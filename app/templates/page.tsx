'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import Card from '@/components/ui/Card';
import PageTitle from '@/components/ui/PageTitle';
import Typography from '@/components/ui/Typography';
import { ArrowLeft, Camera, Check } from 'lucide-react';
import { TemplateService } from '@/services/template_service';
import { TemplateModel } from '@/models/template_model';

import { useSessionStore } from '@/store/session_store';
import { SessionRepository } from '@/repositories/session_repository';
import { startSessionTimer, getSessionTimeLeft, useSessionTimer, formatTime } from '@/hooks/useSessionTimer';

const templateService = new TemplateService();
const sessionRepository = new SessionRepository();

type TemplateCard = {
  id: string;
  name: string;
  photoCount: number;
  imageUrl: string;
  tag: string;
};

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateModel[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const sessionId = useSessionStore((state) => state.sessionId);
  const setSelectedTemplateStore = useSessionStore((state) => state.setSelectedTemplate);

  const sessionTimeLeft = useSessionTimer(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('boro_selected_template');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { id: string; name: string };
        setSelectedTemplateId(parsed.id);
      } catch (_) {
        setSelectedTemplateId(null);
      }
    }

    // Mulai timer 15 menit saat customer masuk halaman pilih template.
    // Guard: hanya mulai jika belum ada timer aktif agar tidak di-reset
    // ketika customer kembali ke halaman ini.
    if (getSessionTimeLeft() === 0) {
      startSessionTimer();
    }
  }, []);

  useEffect(() => {
    templateService
      .getActiveTemplates()
      .then((fetched) => setTemplates(fetched))
      .catch(() => setTemplates(TemplateModel.localTemplates))
      .finally(() => setLoading(false));
  }, []);

  const cards: TemplateCard[] = useMemo(() => {
    const sourceTemplates = templates.length > 0 ? templates : TemplateModel.localTemplates;

    return sourceTemplates.map((template, index) => ({
      id: template.id,
      name: template.name || `Template ${index + 1}`,
      photoCount: template.photoCount || 3,
      imageUrl: template.thumbnail || template.imageUrl,
      tag: index === 0 ? 'Populer' : '',
    }));
  }, [templates]);

  const selectedTemplate = useMemo(
    () => cards.find((template) => template.id === selectedTemplateId) ?? null,
    [cards, selectedTemplateId]
  );

  const handleSelect = (template: TemplateCard) => {
    setSelectedTemplateId(template.id);
    setSelectedTemplateStore(template.id, template.name);
    sessionStorage.setItem(
      'boro_selected_template',
      JSON.stringify({ id: template.id, name: template.name, photoCount: template.photoCount })
    );
  };

  const handleConfirm = async () => {
    if (!selectedTemplate) return;
    
    if (sessionId) {
      try {
        await sessionRepository.updateTemplate({
          sessionId,
          templateId: selectedTemplate.id,
          templateName: selectedTemplate.name,
        });
        await sessionRepository.updateStage(sessionId, 'TEMPLATE_SELECTED');
      } catch (e) {
        console.error('Failed to update template in Firestore:', e);
      }
    }
    
    router.push('/camera');
  };

  const timerElement = (
    <div className="flex items-center justify-center rounded-full bg-red-50 px-3 py-1 border border-red-100 ml-2">
      <Typography variant="label" className="text-red-600 font-bold tracking-widest text-sm">
        {formatTime(sessionTimeLeft)}
      </Typography>
    </div>
  );

  return (
    <MainLayout step={3} footerHint="Pilih template yang Anda sukai untuk mulai berfoto" headerLeftElement={timerElement}>
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 px-4 py-6">
        <PageTitle
          title="Pilih Template"
          subtitle="Pilih frame yang paling sesuai dengan suasana foto Anda."
        />

        {loading ? (
          <div className="flex justify-center py-10">
            <Typography variant="body" className="text-black/50">Memuat template...</Typography>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {cards.map((tpl) => {
              const selected = tpl.id === selectedTemplateId;
              return (
                <motion.button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelect(tpl)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className={
                    `relative flex flex-col overflow-hidden rounded-3xl border p-0 text-left transition-all duration-200 ` +
                    (selected
                      ? 'border-[#E83E8C] bg-[#E83E8C]/5 shadow-[0_0_20px_rgba(232,62,140,0.15)]'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100')
                  }
                >
                  <div className="h-64 flex items-center justify-center bg-gray-200 overflow-hidden relative">
                    {tpl.imageUrl ? (
                      <img 
                        src={tpl.imageUrl} 
                        alt={tpl.name} 
                        className="w-full h-full object-contain bg-white" 
                      />
                    ) : (
                      <Camera size={32} className="opacity-30 text-gray-500" />
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-lg font-semibold text-black">{tpl.name}</p>
                      {tpl.tag ? (
                        <span className="rounded-full bg-[#E83E8C] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white">
                          {tpl.tag}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm text-black/60">{tpl.photoCount} foto per sesi</p>
                  </div>

                  {selected && (
                    <div className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-[#E83E8C]" />
                  )}
                </motion.button>
              );
            })}
          </div>
        )}

        <Card className="rounded-3xl border border-gray-200 bg-gray-50 p-5 mt-auto">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Typography variant="label" className="text-black/50 uppercase tracking-[0.25em]">
                Pilih Template
              </Typography>
              <Typography variant="body" className="mt-2 text-black/70 leading-relaxed">
                {selectedTemplate
                  ? `Template dipilih: ${selectedTemplate.name}`
                  : loading
                  ? 'Memuat template...'
                  : 'Pilih salah satu template untuk melanjutkan ke sesi foto.'}
              </Typography>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <PrimaryButton size="md" fullWidth disabled={!selectedTemplate} onClick={handleConfirm}>
                <Check size={16} />
                {selectedTemplate ? 'Lanjut ke Kamera' : 'Pilih template terlebih dahulu'}
              </PrimaryButton>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
