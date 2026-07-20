'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import PageTitle from '@/components/ui/PageTitle';
import Card from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AppConstants } from '@/constants/app_constants';

export default function RulesPage() {
  return (
    <MainLayout step={2} footerHint="Baca seluruh aturan sebelum melanjutkan">
      <div className="w-full h-full flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-3xl">
          <PageTitle
            title="Aturan Penggunaan"
            subtitle="Pastikan Anda memahami aturan berikut sebelum memulai sesi foto."
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-8"
          >
            <Card className="overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {AppConstants.rules.map((rule, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.12 + i * 0.06 }}
                    className="flex items-start gap-4 px-6 py-4"
                  >
                    <div className="mt-1">
                      <CheckCircle2 size={18} className="text-[#E6007A]" />
                    </div>
                    <Typography variant="body" className="text-black/80 leading-relaxed">
                      {rule}
                    </Typography>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </motion.div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/input-code">
              <SecondaryButton size="sm" fullWidth>
                <ArrowLeft size={15} />
                Kembali
              </SecondaryButton>
            </Link>
            <Link href="/templates">
              <PrimaryButton size="md" fullWidth id="rules-accept-btn">
                OK, SAYA MENGERTI
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
