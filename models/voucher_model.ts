import { Timestamp } from 'firebase/firestore';
import { Voucher as IVoucher } from '../types';

export class VoucherModel implements IVoucher {
  readonly code: string;
  readonly isUsed: boolean;
  readonly status: 'ACTIVE' | 'USED';
  readonly createdAt: Date;
  readonly usedAt: Date | null;
  readonly sessionId: string | null;

  constructor(data: IVoucher) {
    this.code = data.code;
    this.isUsed = data.isUsed;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.usedAt = data.usedAt;
    this.sessionId = data.sessionId;
  }

  static fromFirestore(docId: string, data: Record<string, any>): VoucherModel {
    const parseDate = (val: any): Date | null => {
      if (!val) return null;
      if (val instanceof Timestamp) return val.toDate();
      if (typeof val.toDate === 'function') return val.toDate();
      if (typeof val.seconds === 'number') return new Timestamp(val.seconds, val.nanoseconds || 0).toDate();
      if (val instanceof Date) return val;
      return new Date(val);
    };

    return new VoucherModel({
      code: docId,
      isUsed: !!data.is_used,
      status: data.status === 'USED' ? 'USED' : 'ACTIVE',
      createdAt: parseDate(data.created_at) || new Date(),
      usedAt: parseDate(data.used_at),
      sessionId: data.session_id || null,
    });
  }

  toFirestore(): Record<string, any> {
    const result: Record<string, any> = {
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

  copyWith(changes: Partial<IVoucher>): VoucherModel {
    return new VoucherModel({
      code: changes.code !== undefined ? changes.code : this.code,
      isUsed: changes.isUsed !== undefined ? changes.isUsed : this.isUsed,
      status: changes.status !== undefined ? changes.status : this.status,
      createdAt: changes.createdAt !== undefined ? changes.createdAt : this.createdAt,
      usedAt: changes.usedAt !== undefined ? changes.usedAt : this.usedAt,
      sessionId: changes.sessionId !== undefined ? changes.sessionId : this.sessionId,
    });
  }
}
