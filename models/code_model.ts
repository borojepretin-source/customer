import { Timestamp } from 'firebase/firestore';
import { Code as ICode } from '../types';

export class CodeModel implements ICode {
  readonly id: string;
  readonly code: string;
  readonly isUsed: boolean;
  readonly status: 'ACTIVE' | 'USED';
  readonly usedAt: Date | null;
  readonly sessionId: string | null;
  readonly createdAt: Date;

  constructor(data: ICode) {
    this.id = data.id;
    this.code = data.code;
    this.isUsed = data.isUsed;
    this.status = data.status;
    this.usedAt = data.usedAt;
    this.sessionId = data.sessionId;
    this.createdAt = data.createdAt;
  }

  static fromFirestore(docId: string, data: Record<string, any>): CodeModel {
    const parseDate = (val: any): Date | null => {
      if (!val) return null;
      if (val instanceof Timestamp) return val.toDate();
      if (typeof val.toDate === 'function') return val.toDate();
      if (typeof val.seconds === 'number') return new Timestamp(val.seconds, val.nanoseconds || 0).toDate();
      if (val instanceof Date) return val;
      return new Date(val);
    };

    return new CodeModel({
      id: docId,
      code: data.code || '',
      isUsed: !!data.is_used,
      status: data.status === 'USED' ? 'USED' : 'ACTIVE',
      usedAt: parseDate(data.used_at),
      sessionId: data.session_id || null,
      createdAt: parseDate(data.created_at) || new Date(),
    });
  }

  toFirestore(): Record<string, any> {
    const result: Record<string, any> = {
      code: this.code,
      is_used: this.isUsed,
      status: this.status,
      created_at: Timestamp.fromDate(this.createdAt),
    };
    if (this.usedAt) {
      result.used_at = Timestamp.fromDate(this.usedAt);
    }
    if (this.sessionId) {
      result.session_id = this.sessionId;
    }
    return result;
  }

  get isActive(): boolean {
    return !this.isUsed && this.status !== 'USED';
  }

  copyWith(changes: Partial<ICode>): CodeModel {
    return new CodeModel({
      id: changes.id !== undefined ? changes.id : this.id,
      code: changes.code !== undefined ? changes.code : this.code,
      isUsed: changes.isUsed !== undefined ? changes.isUsed : this.isUsed,
      status: changes.status !== undefined ? changes.status : this.status,
      usedAt: changes.usedAt !== undefined ? changes.usedAt : this.usedAt,
      sessionId: changes.sessionId !== undefined ? changes.sessionId : this.sessionId,
      createdAt: changes.createdAt !== undefined ? changes.createdAt : this.createdAt,
    });
  }
}
