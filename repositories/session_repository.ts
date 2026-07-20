import {
  Firestore,
  collection,
  doc,
  writeBatch,
  serverTimestamp,
  updateDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
  onSnapshot,
  CollectionReference,
  DocumentData,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AppConstants } from '../constants/app_constants';
import { SessionModel } from '../models/session_model';

export class SessionRepository {
  private readonly firestore: Firestore;

  constructor(firestore?: Firestore) {
    this.firestore = firestore || db;
  }

  private get sessionsCollection(): CollectionReference<DocumentData> {
    return collection(this.firestore, AppConstants.colSessions);
  }

  private get codesCollection(): CollectionReference<DocumentData> {
    return collection(this.firestore, AppConstants.colCodes);
  }

  /**
   * Buat session baru dan update code menjadi USED secara atomik (Batch Write).
   */
  async createSessionAndMarkCodeUsed(params: {
    code: string;
    codeDocId: string;
    device: string;
  }): Promise<string> {
    const { code, codeDocId, device } = params;
    const sessionRef = doc(this.sessionsCollection);
    const sessionId = sessionRef.id;
    const codeRef = doc(this.codesCollection, codeDocId);
    const now = serverTimestamp();

    const batch = writeBatch(this.firestore);

    // 1. Buat session baru
    batch.set(sessionRef, {
      code,
      status: 'STARTED',
      stage: 'STARTED',
      started_at: now,
      finished_at: null,
      device,
      template_id: null,
      template_name: null,
      email: null,
      printed: false,
      photo_count: 0,
    });

    // 2. Update code menjadi USED
    batch.update(codeRef, {
      is_used: true,
      status: 'USED',
      used_at: now,
      session_id: sessionId,
    });

    try {
      await batch.commit();
      console.log(`[SessionRepo] ✅ Session ${sessionId} dibuat, kode ${code} → USED`);
      return sessionId;
    } catch (e) {
      console.error('[SessionRepo] ❌ Batch write gagal:', e);
      throw new Error(`Gagal memulai sesi. Silakan coba lagi. (${e})`);
    }
  }

  /**
   * Update satu atau lebih field pada session yang sedang berjalan
   */
  async updateSessionField(sessionId: string, fields: Record<string, any>): Promise<void> {
    if (!sessionId) return;
    try {
      const sessionRef = doc(this.sessionsCollection, sessionId);
      await updateDoc(sessionRef, fields);
      console.log(`[SessionRepo] Session ${sessionId} updated: ${Object.keys(fields).join(', ')}`);
    } catch (e) {
      console.error(`[SessionRepo] Gagal update session ${sessionId}:`, e);
    }
  }

  /**
   * Update template yang dipilih
   */
  async updateTemplate(params: {
    sessionId: string;
    templateId: string;
    templateName: string;
  }): Promise<void> {
    await this.updateSessionField(params.sessionId, {
      template_id: params.templateId,
      template_name: params.templateName,
    });
  }

  /**
   * Update jumlah foto yang sudah diambil
   */
  async updatePhotoCount(params: { sessionId: string; photoCount: number }): Promise<void> {
    await this.updateSessionField(params.sessionId, { photo_count: params.photoCount });
  }

  /**
   * Update email pelanggan
   */
  async updateEmail(params: { sessionId: string; email: string }): Promise<void> {
    await this.updateSessionField(params.sessionId, { email: params.email });
  }

  /**
   * Tandai email berhasil dikirim: simpan email, stage EMAIL_SENT, dan timestamp pengiriman.
   * Dipanggil dari frontend setelah Cloud Function / API route berhasil.
   */
  async markEmailSent(sessionId: string, email: string): Promise<void> {
    await this.updateSessionField(sessionId, {
      email,
      stage: 'EMAIL_SENT',
      email_sent_at: serverTimestamp(),
    });
  }

  /**
   * Tandai session sebagai selesai dicetak
   */
  async markAsPrinted(sessionId: string): Promise<void> {
    await this.updateSessionField(sessionId, { printed: true });
  }

  /**
   * Tandai session sebagai FINISHED
   */
  async finishSession(sessionId: string): Promise<void> {
    await this.updateSessionField(sessionId, {
      status: 'FINISHED',
      stage: 'COMPLETED',
      finished_at: serverTimestamp(),
    });
  }

  /**
   * Tandai session sebagai ABANDONED (timeout / keluar sebelum selesai)
   */
  async abandonSession(sessionId: string): Promise<void> {
    await this.updateSessionField(sessionId, {
      status: 'ABANDONED',
      stage: 'CANCELLED',
      finished_at: serverTimestamp(),
    });
  }

  /**
   * Update stage granular sesi
   */
  async updateStage(sessionId: string, stage: string): Promise<void> {
    await this.updateSessionField(sessionId, { stage });
  }

  /**
   * Batalkan session (ABANDONED + CANCELLED) jika user keluar sebelum selesai
   */
  async cancelSession(sessionId: string): Promise<void> {
    await this.updateSessionField(sessionId, {
      status: 'ABANDONED',
      stage: 'CANCELLED',
      finished_at: serverTimestamp(),
    });
  }

  /**
   * Ambil session berdasarkan ID
   */
  async getSession(sessionId: string): Promise<SessionModel | null> {
    try {
      const sessionRef = doc(this.sessionsCollection, sessionId);
      const docSnap = await getDoc(sessionRef);
      if (!docSnap.exists()) return null;
      return SessionModel.fromFirestore(docSnap.id, docSnap.data());
    } catch (e) {
      console.error('[SessionRepo] getSession error:', e);
      return null;
    }
  }

  /**
   * Ambil semua session, diurutkan dari terbaru
   */
  async getAllSessions(options?: { from?: Date; to?: Date }): Promise<SessionModel[]> {
    try {
      let q = query(this.sessionsCollection, orderBy('started_at', 'desc'));

      if (options?.from) {
        q = query(q, where('started_at', '>=', Timestamp.fromDate(options.from)));
      }
      if (options?.to) {
        q = query(q, where('started_at', '<=', Timestamp.fromDate(options.to)));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => SessionModel.fromFirestore(doc.id, doc.data()));
    } catch (e) {
      console.error('[SessionRepo] getAllSessions error:', e);
      return [];
    }
  }

  /**
   * Watch semua session untuk realtime updates (Returns unsubscribe function)
   */
  watchAllSessions(
    onNext: (sessions: SessionModel[]) => void,
    onError?: (error: Error) => void,
    options?: { from?: Date; to?: Date }
  ): () => void {
    let q = query(this.sessionsCollection, orderBy('started_at', 'desc'));

    if (options?.from) {
      q = query(q, where('started_at', '>=', Timestamp.fromDate(options.from)));
    }
    if (options?.to) {
      q = query(q, where('started_at', '<=', Timestamp.fromDate(options.to)));
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const sessions = snapshot.docs.map((doc) => SessionModel.fromFirestore(doc.id, doc.data()));
        onNext(sessions);
      },
      (error) => {
        if (onError) onError(error);
      }
    );
  }

  /**
   * Sinkronisasi: jika ada kode ACTIVE yang sudah punya session → ubah jadi USED
   */
  async syncOrphanedCodes(): Promise<void> {
    try {
      const qStartedFinished = query(
        this.sessionsCollection,
        where('status', 'in', ['STARTED', 'FINISHED'])
      );
      const sessionSnap = await getDocs(qStartedFinished);

      const usedCodes = new Set<string>();
      sessionSnap.docs.forEach((doc) => {
        const code = doc.data().code;
        if (code) usedCodes.add(code);
      });

      if (usedCodes.size === 0) return;

      const qActiveCodes = query(this.codesCollection, where('is_used', '==', false));
      const codeSnap = await getDocs(qActiveCodes);

      const batch = writeBatch(this.firestore);
      let fixCount = 0;

      codeSnap.docs.forEach((codeDoc) => {
        const code = codeDoc.data().code || '';
        if (usedCodes.has(code)) {
          batch.update(codeDoc.ref, {
            is_used: true,
            status: 'USED',
          });
          fixCount++;
        }
      });

      if (fixCount > 0) {
        await batch.commit();
        console.log(`[SessionRepo] syncOrphanedCodes: fixed ${fixCount} orphaned codes`);
      } else {
        console.log('[SessionRepo] syncOrphanedCodes: no orphaned codes found');
      }
    } catch (e) {
      console.error('[SessionRepo] syncOrphanedCodes error (non-fatal):', e);
    }
  }
}
