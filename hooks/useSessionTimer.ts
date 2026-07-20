'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const TIMER_DURATION = 900; // 15 menit (900 detik)
const STORAGE_KEY = 'boro_session_start_at'; // Unix timestamp (ms) saat timer dimulai

/**
 * Mulai sesi timer baru. Dipanggil saat customer memilih template.
 * Menulis timestamp ke sessionStorage agar timer persisten lintas halaman.
 */
export function startSessionTimer(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEY, Date.now().toString());
  }
}

/**
 * Menghentikan sesi timer. Dipanggil saat customer masuk ke halaman Edit.
 */
export function stopSessionTimer(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Kembalikan sisa waktu (detik) berdasarkan timestamp yang disimpan.
 * Jika tidak ada timer aktif, kembalikan 0.
 */
export function getSessionTimeLeft(): number {
  if (typeof window === 'undefined') return 0;
  
  const startAtStr = sessionStorage.getItem(STORAGE_KEY);
  if (!startAtStr) return 0;
  const startAt = parseInt(startAtStr, 10);
  if (isNaN(startAt)) return 0;
  const elapsed = Math.floor((Date.now() - startAt) / 1000);
  return Math.max(0, TIMER_DURATION - elapsed);
}

/**
 * Hook untuk menggunakan timer session global.
 *
 * - Membaca waktu tersisa dari sessionStorage (bukan dari state lokal).
 * - Countdown tidak pernah di-reset saat berpindah halaman.
 * - Memanggil onExpire() satu kali saat waktu habis.
 * - Tidak membuat interval baru jika halaman adalah edit-photo (stopOnMount=true).
 *
 * @param stopOnMount — set true di halaman edit-photo agar timer langsung dihentikan
 * @param onExpire — callback dipanggil satu kali saat waktu habis
 */
export function useSessionTimer(
  stopOnMount: boolean = false,
  onExpire?: () => void
): number {
  // Inisialisasi state ke 0 agar sama antara server render dan client hydration.
  // Nilai sebenarnya akan di-set oleh useEffect setelah komponen ter-mount di client.
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const expiredRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (stopOnMount) {
      stopSessionTimer();
      return;
    }

    // Tidak ada timer aktif (belum pilih template)
    if (getSessionTimeLeft() === 0) return;

    expiredRef.current = false;

    const tick = () => {
      const remaining = getSessionTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        if (onExpire) {
          onExpire();
        }
      }
    };

    tick(); // run immediately
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopOnMount]);

  return timeLeft;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
