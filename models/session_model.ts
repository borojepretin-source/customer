import { Timestamp } from 'firebase/firestore';
import { Session as ISession, SessionStatus, SessionStage } from '../types';

export class SessionModel implements ISession {
  readonly id: string;
  readonly code: string;
  readonly status: SessionStatus;
  readonly stage: SessionStage;
  readonly startedAt: Date;
  readonly finishedAt: Date | null;
  readonly device: string;
  readonly templateId: string | null;
  readonly templateName: string | null;
  readonly email: string | null;
  readonly printed: boolean;
  readonly photoCount: number;

  constructor(data: ISession) {
    this.id = data.id;
    this.code = data.code;
    this.status = data.status;
    this.stage = data.stage;
    this.startedAt = data.startedAt;
    this.finishedAt = data.finishedAt;
    this.device = data.device;
    this.templateId = data.templateId;
    this.templateName = data.templateName;
    this.email = data.email;
    this.printed = data.printed;
    this.photoCount = data.photoCount;
  }

  get duration(): number | null {
    if (!this.finishedAt) return null;
    return this.finishedAt.getTime() - this.startedAt.getTime();
  }

  get durationDisplay(): string {
    const dur = this.duration;
    if (dur === null) return '—';
    const totalSeconds = Math.floor(dur / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  }

  static fromFirestore(docId: string, data: Record<string, any>): SessionModel {
    const parseDate = (val: any): Date | null => {
      if (!val) return null;
      if (val instanceof Timestamp) return val.toDate();
      if (typeof val.toDate === 'function') return val.toDate();
      if (typeof val.seconds === 'number') return new Timestamp(val.seconds, val.nanoseconds || 0).toDate();
      if (val instanceof Date) return val;
      return new Date(val);
    };

    const parseStatus = (val?: string): SessionStatus => {
      switch (val?.toUpperCase()) {
        case 'FINISHED': return SessionStatus.FINISHED;
        case 'ABANDONED': return SessionStatus.ABANDONED;
        default: return SessionStatus.STARTED;
      }
    };

    const parseStage = (val?: string): SessionStage => {
      switch (val?.toUpperCase()) {
        case 'PHOTO_CAPTURED': return SessionStage.PHOTO_CAPTURED;
        case 'PREVIEW': return SessionStage.PREVIEW;
        case 'EMAIL_SENT': return SessionStage.EMAIL_SENT;
        case 'PRINTED': return SessionStage.PRINTED;
        case 'COMPLETED': return SessionStage.COMPLETED;
        case 'CANCELLED': return SessionStage.CANCELLED;
        default: return SessionStage.STARTED;
      }
    };

    return new SessionModel({
      id: docId,
      code: data.code || '',
      status: parseStatus(data.status),
      stage: parseStage(data.stage),
      startedAt: parseDate(data.started_at) || new Date(),
      finishedAt: parseDate(data.finished_at),
      device: data.device || 'web',
      templateId: data.template_id || null,
      templateName: data.template_name || null,
      email: data.email || null,
      printed: !!data.printed,
      photoCount: typeof data.photo_count === 'number' ? data.photo_count : 0,
    });
  }

  toFirestore(): Record<string, any> {
    const result: Record<string, any> = {
      code: this.code,
      status: this.status,
      stage: this.stage,
      started_at: Timestamp.fromDate(this.startedAt),
      device: this.device,
      template_id: this.templateId,
      template_name: this.templateName,
      email: this.email,
      printed: this.printed,
      photo_count: this.photoCount,
    };
    if (this.finishedAt) {
      result.finished_at = Timestamp.fromDate(this.finishedAt);
    } else {
      result.finished_at = null;
    }
    return result;
  }

  copyWith(changes: Partial<ISession>): SessionModel {
    return new SessionModel({
      id: changes.id !== undefined ? changes.id : this.id,
      code: changes.code !== undefined ? changes.code : this.code,
      status: changes.status !== undefined ? changes.status : this.status,
      stage: changes.stage !== undefined ? changes.stage : this.stage,
      startedAt: changes.startedAt !== undefined ? changes.startedAt : this.startedAt,
      finishedAt: changes.finishedAt !== undefined ? changes.finishedAt : this.finishedAt,
      device: changes.device !== undefined ? changes.device : this.device,
      templateId: changes.templateId !== undefined ? changes.templateId : this.templateId,
      templateName: changes.templateName !== undefined ? changes.templateName : this.templateName,
      email: changes.email !== undefined ? changes.email : this.email,
      printed: changes.printed !== undefined ? changes.printed : this.printed,
      photoCount: changes.photoCount !== undefined ? changes.photoCount : this.photoCount,
    });
  }
}
