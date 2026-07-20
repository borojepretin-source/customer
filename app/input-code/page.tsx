'use client';

import { KeyboardEvent, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import PageTitle from '@/components/ui/PageTitle';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import Typography from '@/components/ui/Typography';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { VoucherRepository } from '@/repositories/voucher_repository';
import { Validators } from '@/utils/validators';

import { useSessionStore } from '@/store/session_store';

const repository = new VoucherRepository();

export default function InputCodePage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const setSessionId = useSessionStore((state) => state.setSessionId);
  const setVoucherCode = useSessionStore((state) => state.setVoucherCode);

  const validationError = useMemo(() => Validators.validateCode(code), [code]);
  const canSubmit = !!code.trim() && !validationError && !loading;

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    if (canSubmit) {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      setErrorMessage(validationError ?? 'Kode tidak valid.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const sessionId = await repository.validateAndActivateVoucher({
        rawCode: code,
        device: typeof navigator !== 'undefined' ? navigator.userAgent : 'web',
      });

      setSessionId(sessionId);
      setVoucherCode(code);

      router.push('/rules');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan saat memvalidasi kode.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout step={1} footerHint="Masukkan kode 4–8 karakter yang tertera pada tiket Anda">
      <div className="w-full h-full flex items-center justify-center px-4 py-6">
        <Card className="w-full max-w-xl p-8 sm:p-10">
          <div className="flex flex-col gap-8">
            <PageTitle
              title="Masukkan Kode Anda"
              subtitle="Periksa tiket atau pesan yang diterima dan masukkan kode akses Anda di bawah ini."
            />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="rounded-3xl border border-gray-200 bg-gray-50 p-8 flex flex-col items-center gap-6"
            >
              <div
                className="w-16 h-16 rounded-3xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #E6007A22, #9b27af22)', border: '1px solid #E6007A44' }}
              >
                <KeyRound size={28} className="text-[#E6007A]" />
              </div>

              <div className="w-full">
                <label htmlFor="voucher-code-input" className="block mb-3 text-sm font-semibold text-black/60 uppercase tracking-[0.24em]">
                  Kode Akses
                </label>
                <input
                  id="voucher-code-input"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onKeyDown={handleKeyDown}
                  placeholder="A7FD-1234"
                  maxLength={8}
                  className="w-full text-center text-3xl font-bold tracking-[0.35em] bg-transparent border-b-2 border-gray-300 focus:border-[#E83E8C] text-black placeholder:text-black/30 outline-none pb-3 transition-colors duration-200 uppercase"
                  autoFocus
                />
                <Typography variant="caption" className="mt-4 text-black/50">
                  Kode harus berisi 4–8 karakter alfanumerik tanpa spasi.
                </Typography>
              </div>

              <PrimaryButton
                id="submit-code-btn"
                size="lg"
                fullWidth
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                VALIDASI KODE
              </PrimaryButton>
            </motion.div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/">
                <SecondaryButton size="sm" fullWidth>
                  <ArrowLeft size={15} />
                  Kembali
                </SecondaryButton>
              </Link>

              <Typography variant="label" className="text-black/50 text-center sm:text-right">
                Tekan Enter untuk mengirim.
              </Typography>
            </div>
          </div>
        </Card>

        <Modal open={!!errorMessage} onClose={() => setErrorMessage(null)} title="Kesalahan Kode">
          <div className="space-y-4">
            <Typography variant="body" className="text-black">
              {errorMessage}
            </Typography>
            <PrimaryButton size="sm" fullWidth onClick={() => setErrorMessage(null)}>
              Tutup
            </PrimaryButton>
          </div>
        </Modal>

        <LoadingOverlay visible={loading} message="Memvalidasi kode..." />
      </div>
    </MainLayout>
  );
}
