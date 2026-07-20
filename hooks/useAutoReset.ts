import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '../store/session_store';
import { SessionRepository } from '../repositories/session_repository';

const sessionRepository = new SessionRepository();

export function useAutoReset(seconds: number = 10) {
  const router = useRouter();
  const { sessionId, reset: resetStore } = useSessionStore();
  const [timeLeft, setTimeLeft] = useState(seconds);

  const handleReset = async () => {
    try {
      if (sessionId) {
        await sessionRepository.finishSession(sessionId);
      }
    } catch (e) {
      console.error('Failed to finish session in Firestore:', e);
    }
    
    // Clear storage & state
    resetStore();
    sessionStorage.clear();
    router.replace('/');
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      handleReset();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  return { timeLeft, handleReset };
}
