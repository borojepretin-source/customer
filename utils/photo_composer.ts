import { TemplateModel } from '../models/template_model';
import { LayoutModel } from '../models/layout_model';

export interface PhotoSlot {
  id: string;
  dataUrl: string;
}

/**
 * PhotoComposer
 *
 * Alur:
 *  1. Buat canvas sesuai ukuran template PNG (canvasWidth x canvasHeight)
 *  2. Gambar foto user ke setiap slot dengan object-fit: cover (crop center, no stretch)
 *  3. Gambar template PNG di atas sebagai overlay (frame)
 *  4. Export canvas ke PNG Blob (kualitas asli)
 *
 * Hasil Blob ini digunakan bersama oleh:
 *  - Preview (sebagai ObjectURL)
 *  - Email (sebagai base64)
 *  - Print (buka window print dengan gambar yang sama)
 */
export class PhotoComposer {
  /**
   * Helper: load gambar dari URL atau data URL.
   * Tidak set crossOrigin untuk data:/blob: URL agar canvas tidak jadi "tainted".
   */
  static loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      if (!src) {
        reject(new Error('Image source is empty'));
        return;
      }
      const img = new Image();
      if (src.startsWith('http://') || src.startsWith('https://')) {
        img.crossOrigin = 'anonymous';
      }
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });
  }

  /**
   * Gambar satu foto ke slot canvas dengan object-fit: cover.
   * Foto selalu memenuhi slot, tidak ada ruang kosong, aspect ratio dijaga.
   */
  private static drawCover(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    destX: number,
    destY: number,
    destW: number,
    destH: number,
    opacity: number = 1,
    rotation: number = 0
  ): void {
    const srcW = img.naturalWidth;
    const srcH = img.naturalHeight;

    if (srcW === 0 || srcH === 0 || destW === 0 || destH === 0) return;

    // Hitung crop untuk object-fit: cover (center crop)
    const srcAspect = srcW / srcH;
    const dstAspect = destW / destH;

    let sx = 0, sy = 0, sw = srcW, sh = srcH;

    if (srcAspect > dstAspect) {
      // Sumber lebih lebar → crop kiri kanan
      sw = srcH * dstAspect;
      sx = (srcW - sw) / 2;
    } else {
      // Sumber lebih tinggi → crop atas bawah
      sh = srcW / dstAspect;
      sy = (srcH - sh) / 2;
    }

    ctx.save();
    ctx.globalAlpha = opacity;

    if (rotation) {
      const cx = destX + destW / 2;
      const cy = destY + destH / 2;
      ctx.translate(cx, cy);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-cx, -cy);
    }

    // Clip ke area slot agar foto tidak tumpah ke luar frame
    ctx.beginPath();
    ctx.rect(destX, destY, destW, destH);
    ctx.clip();

    ctx.drawImage(img, sx, sy, sw, sh, destX, destY, destW, destH);

    ctx.restore();
  }

  /**
   * Compose foto user + template PNG menjadi satu gambar final.
   *
   * @returns Blob PNG hasil compose (kualitas asli, tidak di-compress ke JPEG)
   */
  static async compose(params: {
    template: TemplateModel;
    layout: LayoutModel;
    photos: PhotoSlot[];
    fallbackColor?: string;
  }): Promise<Blob> {
    const { template, layout, photos, fallbackColor = '#000000' } = params;

    // ── 1. Buat canvas sesuai ukuran template ──────────────────────────────
    const canvas = document.createElement('canvas');
    const width = template.canvasWidth || 600;
    const height = template.canvasHeight || 1800;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2D canvas context');

    // Isi background (akan tertutup oleh foto dan template PNG)
    ctx.fillStyle = fallbackColor;
    ctx.fillRect(0, 0, width, height);

    // ── 2. Load template image (if any) ──────────────────────────────────
    const overlayUrl = template.templateImage || template.imageUrl;
    let overlayImg: HTMLImageElement | null = null;
    if (overlayUrl) {
      try {
        overlayImg = await PhotoComposer.loadImage(overlayUrl);
      } catch (e) {
        console.warn('[PhotoComposer] Gagal load template overlay:', e);
      }
    }

    const drawPhotos = async () => {
      for (let i = 0; i < layout.slots.length; i++) {
        const slot = layout.slots[i];
        const photo = photos[i];

        if (!photo?.dataUrl) continue;

        try {
          const img = await PhotoComposer.loadImage(photo.dataUrl);
          PhotoComposer.drawCover(
            ctx,
            img,
            slot.x,
            slot.y,
            slot.width,
            slot.height,
            slot.opacity ?? 1,
            slot.rotation ?? 0
          );
        } catch (e) {
          console.error(`[PhotoComposer] Gagal gambar foto slot ${slot.slotNumber}:`, e);
        }
      }
    };

    // ── 3. Draw depending on drawOnTop ───────────────────────────────────
    if (layout.drawOnTop) {
      if (overlayImg) ctx.drawImage(overlayImg, 0, 0, width, height);
      await drawPhotos();
    } else {
      await drawPhotos();
      if (overlayImg) {
        ctx.drawImage(overlayImg, 0, 0, width, height);
      } else {
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, width - 4, height - 4);
      }
    }

    // ── 4. Export canvas ke PNG Blob (tanpa kompresi lossy) ───────────────
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('[PhotoComposer] Gagal generate canvas blob'));
          }
        },
        'image/png'
      );
    });
  }

  /**
   * Convert Blob ke base64 data URL (untuk pengiriman email).
   */
  static blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Buka dialog print menggunakan iframe tersembunyi (menghindari popup diblokir).
   */
  static printImage(base64DataUrl: string, templateName?: string): void {
    const iframe = document.createElement('iframe');
    // Sembunyikan iframe
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      console.error('[PhotoComposer] Gagal mendapatkan document iframe untuk print');
      return;
    }

    doc.open();
    doc.write(`<!DOCTYPE html>
<html>
<head>
  <title>Print - ${templateName || 'Photo Booth'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: #fff; }
    img {
      display: block;
      max-width: 100%;
      max-height: 100vh;
      margin: auto;
      object-fit: contain;
    }
    @media print {
      html, body { width: 100%; height: 100%; margin: 0; padding: 0; }
      img { width: 100%; height: 100%; object-fit: contain; page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <img src="${base64DataUrl}" alt="Photo Booth Result" onload="window.print();" />
</body>
</html>`);
    doc.close();

    // Hapus iframe setelah beberapa saat (memberi waktu print dialog muncul)
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 15000);
  }
}
