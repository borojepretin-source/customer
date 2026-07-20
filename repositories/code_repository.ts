import {
  Firestore,
  collection,
  query,
  where,
  limit,
  getDocs,
  addDoc,
  orderBy,
  CollectionReference,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AppConstants } from '../constants/app_constants';
import { CodeModel } from '../models/code_model';
import { withRetry, withTimeout } from '../utils/firestore_helpers';

export class CodeAlreadyUsedException extends Error {
  constructor(public readonly code: string) {
    super(`Kode ${code} sudah pernah digunakan.`);
    this.name = 'CodeAlreadyUsedException';
    Object.setPrototypeOf(this, CodeAlreadyUsedException.prototype);
  }
}

export class CodeRepository {
  private readonly firestore: Firestore;

  constructor(firestore?: Firestore) {
    this.firestore = firestore || db;
  }

  private get collection(): CollectionReference<DocumentData> {
    return collection(this.firestore, AppConstants.colCodes);
  }

  /**
   * Validate a code. Returns CodeModel if valid and unused, null otherwise.
   * Throws CodeAlreadyUsedException if code exists but already used.
   */
  async validateCode(code: string): Promise<CodeModel | null> {
    const normalized = code.trim().toUpperCase();

    try {
      const q = query(this.collection, where('code', '==', normalized), limit(1));
      const queryPromise = getDocs(q);
      const snapshot = await withTimeout(queryPromise, 8000, 'Koneksi ke server timeout.');

      if (snapshot.empty) {
        console.log(`[CodeRepo] Kode ${normalized} tidak ditemukan.`);
        return null;
      }

      const doc = snapshot.docs[0];
      const model = CodeModel.fromFirestore(doc.id, doc.data());

      if (model.isUsed || model.status === 'USED') {
        console.log(`[CodeRepo] Kode ${normalized} sudah digunakan.`);
        throw new CodeAlreadyUsedException(normalized);
      }

      return model;
    } catch (e) {
      if (e instanceof CodeAlreadyUsedException) {
        throw e;
      }
      console.error('[CodeRepo] Firebase error:', e);
      throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    }
  }

  /**
   * Tambah kode baru (untuk admin)
   */
  async addCode(code: string): Promise<void> {
    await withRetry(
      async () => {
        const newCode = new CodeModel({
          id: '',
          code: code.trim().toUpperCase(),
          isUsed: false,
          status: 'ACTIVE',
          usedAt: null,
          sessionId: null,
          createdAt: new Date(),
        });
        const addPromise = addDoc(this.collection, newCode.toFirestore());
        await withTimeout(addPromise, 8000, 'Koneksi ke server timeout.');
      },
      3,
      '[CodeRepo.addCode]'
    );
  }

  /**
   * Ambil semua kode (untuk admin dashboard)
   */
  async getAllCodes(): Promise<CodeModel[]> {
    try {
      const q = query(this.collection, orderBy('created_at', 'desc'));
      const queryPromise = getDocs(q);
      const snapshot = await withTimeout(queryPromise, 10000, 'Koneksi ke server timeout.');
      return snapshot.docs.map((doc) => CodeModel.fromFirestore(doc.id, doc.data()));
    } catch (e) {
      console.error('[CodeRepo] getAllCodes error:', e);
      return [];
    }
  }
}
