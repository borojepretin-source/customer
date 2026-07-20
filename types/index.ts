export interface Code {
  id: string;
  code: string;
  isUsed: boolean;
  status: 'ACTIVE' | 'USED';
  usedAt: Date | null;
  sessionId: string | null;
  createdAt: Date;
}

export interface Slot {
  slotNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fit: 'cover' | 'contain' | 'fill';
  radius: number;
  opacity: number;
}

export interface Layout {
  drawOnTop?: boolean;
  id: string;
  slots: Slot[];
}

export interface PhotoTransform {
  offsetX: number;
  offsetY: number;
  scale: number;
}

export enum SessionStatus {
  STARTED = 'STARTED',
  FINISHED = 'FINISHED',
  ABANDONED = 'ABANDONED',
}

export enum SessionStage {
  STARTED = 'STARTED',
  PHOTO_CAPTURED = 'PHOTO_CAPTURED',
  PREVIEW = 'PREVIEW',
  EMAIL_SENT = 'EMAIL_SENT',
  PRINTED = 'PRINTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Session {
  id: string;
  code: string;
  status: SessionStatus;
  stage: SessionStage;
  startedAt: Date;
  finishedAt: Date | null;
  device: string;
  templateId: string | null;
  templateName: string | null;
  email: string | null;
  printed: boolean;
  photoCount: number;
}

export interface Settings {
  sessionDuration: number;
  inactivityTimeout: number;
  logoUrl: string;
  boothName: string;
  photoCount: number;
  printSize: string;
  emailEnabled: boolean;
  printerEnabled: boolean;
  autoDetectCamera: boolean;
}

export interface Template {
  id: string;
  name: string;
  imageUrl: string;
  thumbnail: string;
  templateImage: string;
  orientation: string;
  printSize: string;
  category: string;
  photoCount: number;
  active: boolean;
  canvasWidth: number;
  canvasHeight: number;
}

export interface Voucher {
  code: string;
  isUsed: boolean;
  status: 'ACTIVE' | 'USED';
  createdAt: Date;
  usedAt: Date | null;
  sessionId: string | null;
}

export interface DeviceStatus {
  firebaseConnected: boolean;
  internetAvailable: boolean;
  printerReady: boolean;
  usbCameraConnected: boolean;
  frontCameraReady: boolean;
  lastChecked: Date;
}
