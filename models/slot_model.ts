import { Slot as ISlot } from '../types';

export class SlotModel implements ISlot {
  readonly slotNumber: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly rotation: number;
  readonly fit: 'cover' | 'contain' | 'fill';
  readonly radius: number;
  readonly opacity: number;

  constructor(data: ISlot) {
    this.slotNumber = data.slotNumber;
    this.x = data.x;
    this.y = data.y;
    this.width = data.width;
    this.height = data.height;
    this.rotation = data.rotation;
    this.fit = data.fit;
    this.radius = data.radius;
    this.opacity = data.opacity;
  }

  static fromMap(map: Record<string, any>, defaultNumber?: number): SlotModel {
    return new SlotModel({
      slotNumber: (typeof map.slotNumber === 'number' ? map.slotNumber : defaultNumber) ?? 1,
      x: Number(map.x ?? 0),
      y: Number(map.y ?? 0),
      width: Number(map.width ?? 200),
      height: Number(map.height ?? 200),
      rotation: Number(map.rotation ?? 0),
      fit: (map.fit as 'cover' | 'contain' | 'fill') || 'cover',
      radius: Number(map.radius ?? 0),
      opacity: Number(map.opacity ?? 1.0),
    });
  }

  toMap(): Record<string, any> {
    return {
      slotNumber: this.slotNumber,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      rotation: this.rotation,
      fit: this.fit,
      radius: this.radius,
      opacity: this.opacity,
    };
  }
}
