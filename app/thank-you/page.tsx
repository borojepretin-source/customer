'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import MainLayout from '@/components/layout/MainLayout';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Camera, Heart } from 'lucide-react';

import { useAutoReset } from '@/hooks/useAutoReset';

export default function ThankYouPage() {
  const { timeLeft, handleReset } = useAutoReset(10);

  return (
    <MainLayout step={7} showFooter={false}>
      <div className="w-full flex flex-col items-center justify-center gap-8 text-center max-w-lg mx-auto">

        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 250,
            damping: 18,
            delay: 0.1,
          }}
          className="relative"
        >
          <div className="relative flex items-center justify-center">
            <Image
              src="/assets/logo/logo.png"
              alt="Sesijepret Logo"
              width={180}
              height={180}
              priority
              className="object-contain"
            />

            {/* Floating Hearts */}
            {[0, 120, 240].map((deg, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.15 }}
                className="absolute"
                style={{
                  top: `${50 + 75 * Math.sin((deg * Math.PI) / 180)}%`,
                  left: `${50 + 75 * Math.cos((deg * Math.PI) / 180)}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <Heart
                  size={18}
                  className="text-[#E83E8C] fill-current"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <h1 className="text-4xl font-bold text-black">
            Terima Kasih! 🎉
          </h1>

          <p className="mt-4 text-base text-black/70 leading-relaxed">
            Foto Anda telah berhasil disimpan dan dikirim ke email.
            <br />
            Semoga momen indah ini selalu menjadi kenangan yang tak terlupakan.
          </p>

          <p className="mt-3 text-sm italic text-black/50">
            Smile • Pose • Capture • Keep The Memories Forever
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-5"
        >
          <p className="text-sm text-black/50">
            Halaman akan kembali ke awal dalam{" "}
            <span className="font-bold text-[#E83E8C]">
              {timeLeft}
            </span>{" "}
            detik
          </p>

          <PrimaryButton
            size="lg"
            id="thankyou-restart-btn"
            onClick={handleReset}
          >
            <Camera size={18} />
            SESI BARU
          </PrimaryButton>
        </motion.div>
      </div>
    </MainLayout>
  );
}