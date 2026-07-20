import { PhotoTransform as IPhotoTransform } from '../types';

export class PhotoTransform implements IPhotoTransform {
  readonly offsetX: number;
  readonly offsetY: number;
  readonly scale: number;

  constructor({
    offsetX = 0.0,
    offsetY = 0.0,
    scale = 1.0,
  }: Partial<IPhotoTransform> = {}) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.scale = scale;
  }

  copyWith(changes: Partial<IPhotoTransform>): PhotoTransform {
    return new PhotoTransform({
      offsetX: changes.offsetX !== undefined ? changes.offsetX : this.offsetX,
      offsetY: changes.offsetY !== undefined ? changes.offsetY : this.offsetY,
      scale: changes.scale !== undefined ? changes.scale : this.scale,
    });
  }
}
