'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import PageTitle from '@/components/ui/PageTitle';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import EmailSuccessDialog from '@/components/dialogs/EmailSuccessDialog';
import EmailErrorDialog from '@/components/dialogs/EmailErrorDialog';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { useSessionStore } from '@/store/session_store';
import { useEmailSend } from '@/hooks/useEmailSend';
import { TemplateService } from '@/services/template_service';
import { StorageService } from '@/services/storage_service';
import { PhotoComposer } from '@/utils/photo_composer';
import { SessionRepository } from '@/repositories/session_repository';
import { TemplateModel } from '@/models/template_model';
import { isValidEmail } from '@/utils/validators';
import toast from 'react-hot-toast';

const templateService = new TemplateService();
const storageService = new StorageService();
const sessionRepository = new SessionRepository();

export default function EmailPage() {
  const router = useRouter();
  const {
    sessionId,
    selectedTemplateId,
    capturedPhotos,
    uploadedPhotoUrl,
    setUploadedPhotoUrl,
    composedPhotoBase64,
    setComposedPhotoBase64,
    setComposedPhotoBlobUrl,
    email: storeEmail,
  } = useSessionStore();

  const { sendEmail, loading: sending, success, error, setSuccess, setError } = useEmailSend();

  const [emailInput, setEmailInput] = useState(storeEmail || '');
  const [preparing, setPreparing] = useState(false);
  const [prepError, setPrepError] = useState<string | null>(null);

  // Compose dan upload saat pertama kali masuk halaman (sekali saja)
  useEffect(() => {
    const preparePhoto = async () => {
      if (!sessionId) {
        toast.error('Sesi tidak ditemukan. Kembali ke awal.');
        router.replace('/');
        return;
      }

      // Sudah di-compose sebelumnya → skip
      if (uploadedPhotoUrl && composedPhotoBase64) {
        return;
      }

      if (capturedPhotos.length === 0) {
        toast.error('Tidak ada foto yang ditemukan.');
        router.replace('/camera');
        return;
      }

      setPreparing(true);
      setPrepError(null);

      try {
        // ── 1. Ambil template & layout ──────────────────────────────────────
        const templates = await templateService.getActiveTemplates();
        const activeTemplate =
          templates.find((t) => t.id === selectedTemplateId) ||
          templates[0] ||
          TemplateModel.localTemplates[0];
        const layout = await templateService.getTemplateLayout(
          activeTemplate.id
        );

        // ── 2. Compose menjadi PNG final ────────────────────────────────────
        const blob = await PhotoComposer.compose({
          template: activeTemplate,
          layout,
          photos: capturedPhotos,
          fallbackColor: '#000000',
        });

        // ── 3. Simpan sebagai Object URL (untuk Preview & Print) ────────────
        const objectUrl = URL.createObjectURL(blob);
        setComposedPhotoBlobUrl(objectUrl);

        // ── 4. Convert ke Base64 (untuk Email) ─────────────────────────────
        const base64String = await PhotoComposer.blobToBase64(blob);
        setComposedPhotoBase64(base64String);

        // ── 5. Convert ke Uint8Array & upload ke Firebase Storage ───────────
        const arrayBuffer = await blob.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        await storageService.saveToLocalStorage({ sessionId, imageBytes: bytes });

        const downloadUrl = await storageService.uploadComposedPhoto({
          sessionId,
          imageBytes: bytes,
        });
        setUploadedPhotoUrl(downloadUrl);

        // ── 6. Update stage di Firestore ────────────────────────────────────
        await sessionRepository.updateStage(sessionId, 'PHOTO_COMPOSED');
      } catch (e: any) {
        console.error('[EmailPage] Gagal compose/upload foto:', e);
        setPrepError(e.message || 'Gagal memproses foto.');
        toast.error('Gagal mempersiapkan foto.');
      } finally {
        setPreparing(false);
      }
    };

    preparePhoto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const handleSendEmail = async () => {
    if (!isValidEmail(emailInput)) {
      toast.error('Masukkan alamat email yang valid.');
      return;
    }
    await sendEmail(emailInput);
  };

  // Setelah email sukses → langsung ke halaman Print
  const handleSuccessConfirm = () => {
    setSuccess(false);
    router.push('/print');
  };

  const handleSkip = () => {
    router.push('/print');
  };

  const handleRetryPrep = () => {
    setUploadedPhotoUrl(null);
    setComposedPhotoBase64(null);
    setComposedPhotoBlobUrl(null);
  };

  return (
    <MainLayout step={6} footerHint="Foto akan dikirim ke email Anda dalam beberapa menit">
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8">
        <PageTitle
          title="Kirim ke Email"
          subtitle="Masukkan email Anda untuk menerima foto hasil sesi ini."
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="w-full rounded-2xl p-8 border border-gray-200 bg-white shadow-md flex flex-col items-center gap-6"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(230,0,122,0.12)', border: '1px solid rgba(230,0,122,0.25)' }}
          >
            <Mail size={28} className="text-[#E6007A]" />
          </div>

          {prepError ? (
            <div className="w-full text-center space-y-3">
              <p className="text-sm text-red-400 font-medium">Gagal mempersiapkan foto hasil akhir.</p>
              <button
                onClick={handleRetryPrep}
                className="text-xs text-[#E6007A] hover:underline font-semibold"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="email-input" className="text-xs text-black/60 font-semibold uppercase tracking-wider">
                Alamat Email
              </label>
              <input
                id="email-input"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="contoh@email.com"
                disabled={preparing || sending}
                className="w-full text-base bg-transparent border-b-2 border-gray-300 focus:border-[#E83E8C] text-black placeholder:text-black/30 outline-none pb-2 transition-colors duration-200"
              />
            </div>
          )}

          <PrimaryButton
            id="send-email-btn"
            size="lg"
            fullWidth
            disabled={!isValidEmail(emailInput) || preparing || sending || !uploadedPhotoUrl}
            onClick={handleSendEmail}
            loading={sending}
          >
            <Send size={16} />
            {sending ? 'Mengirim...' : 'KIRIM FOTO'}
          </PrimaryButton>
        </motion.div>

        <div className="flex items-center gap-4">
          <Link href="/edit-photo">
            <SecondaryButton size="sm">
              <ArrowLeft size={15} />
              Kembali
            </SecondaryButton>
          </Link>
          <button onClick={handleSkip} className="px-4 py-2 text-sm font-semibold text-black/50 hover:text-black hover:bg-gray-100 rounded-xl transition-all">
            Lewati
          </button>
        </div>
      </div>

      {/* Loading overlay untuk proses compose */}
      <LoadingOverlay visible={preparing} message="Memproses foto hasil akhir..." />

      {/* Success Dialog */}
      <EmailSuccessDialog open={success} email={emailInput} onConfirm={handleSuccessConfirm} />

      {/* Error Dialog */}
      <EmailErrorDialog
        open={!!error}
        error={error || ''}
        onRetry={() => {
          setError(null);
          handleSendEmail();
        }}
        onSkip={() => {
          setError(null);
          handleSkip();
        }}
      />
    </MainLayout>
  );
}
