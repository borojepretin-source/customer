import { TemplateModel } from '../models/template_model';
import { LayoutModel } from '../models/layout_model';
import { PhotoTransform } from '../models/photo_transform';

export interface ITemplateRenderer {
  renderToCanvas(params: {
    canvas: HTMLCanvasElement;
    template: TemplateModel;
    layout: LayoutModel;
    photos: (Uint8Array | null)[];
    transforms: PhotoTransform[];
    showPlaceholders?: boolean;
    interactive?: boolean;
    activeInteractiveIndex?: number;
    onTransformChanged?: (index: number, transform: PhotoTransform) => void;
  }): Promise<void>;

  exportToBlob(params: {
    template: TemplateModel;
    layout: LayoutModel;
    photos: Uint8Array[];
    transforms: PhotoTransform[];
  }): Promise<Blob>;
}

/**
 * TODO: Implement rendering engine using HTML5 Canvas or Konva.js to compose the final photo.
 * This class will load the overlay image, parse the slots layout, position the user images
 * with applied scale and offsets, and export/draw it to a canvas.
 */
export class TemplateRenderer implements ITemplateRenderer {
  async renderToCanvas(params: {
    canvas: HTMLCanvasElement;
    template: TemplateModel;
    layout: LayoutModel;
    photos: (Uint8Array | null)[];
    transforms: PhotoTransform[];
    showPlaceholders?: boolean;
    interactive?: boolean;
    activeInteractiveIndex?: number;
    onTransformChanged?: (index: number, transform: PhotoTransform) => void;
  }): Promise<void> {
    // TODO: Implement Canvas/Konva rendering for slots and frame overlay
    throw new Error('Method not implemented. Implement using HTML Canvas / Konva in the UI layer.');
  }

  async exportToBlob(params: {
    template: TemplateModel;
    layout: LayoutModel;
    photos: Uint8Array[];
    transforms: PhotoTransform[];
  }): Promise<Blob> {
    // TODO: Draw the slots, frames, and export the canvas to a JPEG Blob at full resolution
    throw new Error('Method not implemented. Implement using HTML Canvas / Konva in the UI layer.');
  }
}
