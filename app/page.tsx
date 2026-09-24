'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import MainLayout from '@/components/layout/MainLayout';
import PrimaryButton from '@/components/ui/PrimaryButton';
import Card from '@/components/ui/Card';
import PageTitle from '@/components/ui/PageTitle';
import Typography from '@/components/ui/Typography';

export default function WelcomePage() {
  return (
    <MainLayout
      showHeader
      step={0}
      footerHint="Sentuh MULAI untuk memulai sesi foto Anda"
    >
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center gap-10 px-6 py-8 lg:flex-row">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2"
        >
          <Card className="p-8 lg:p-10">

            {/* Logo */}
            <div className="mb-8">
              <Image
                src="/assets/logo/logo.png"
                alt="Sesijepret"
                width={180}
                height={60}
                priority
                className="object-contain"
              />
            </div>

            <PageTitle
              title="Selamat Datang di Sesijepret"
              subtitle="Abadikan momen seru bersama teman dan keluarga di photo booth kami."
              centered={false}
            />

            <div className="mt-6 space-y-4">
              <Typography
                variant="body"
                className="leading-relaxed text-black/70"
              >
                Masukkan kode voucher yang Anda miliki, pilih template favorit,
                lalu abadikan momen terbaik bersama orang-orang tersayang.
              </Typography>

              <Typography
                variant="body"
                className="leading-relaxed text-black/70"
              >
                Setelah selesai, hasil foto dapat langsung dicetak dan dikirim
                ke email Anda secara otomatis.
              </Typography>
            </div>

            <div className="mt-10">
              <Link href="/input-code" className="block">
                <PrimaryButton size="lg" fullWidth>
                  MULAI
                </PrimaryButton>
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Right Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex w-full items-center justify-center lg:w-1/2"
        >
          <Image
            src="/assets/images/Group 1.png"
            alt="Photo Booth Illustration"
            width={650}
            height={650}
            priority
            className="h-auto w-full max-w-xl object-contain"
          />
        </motion.div>

      </div>
    </MainLayout>
  );
}