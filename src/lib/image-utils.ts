export async function readImageFile(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

export function canvasToDataUrl(canvas: HTMLCanvasElement, quality = 0.92): string {
  return canvas.toDataURL('image/png', quality);
}

export function downloadDataUrl(url: string, filename: string) {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function applyBasicAdjustments(
  img: HTMLImageElement,
  options: { brightness?: number; contrast?: number; saturate?: number; hue?: number; blur?: number; sepia?: number; grayscale?: number }
) {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const {
    brightness = 100,
    contrast = 100,
    saturate = 100,
    hue = 0,
    blur = 0,
    sepia = 0,
    grayscale = 0
  } = options;

  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) hue-rotate(${hue}deg) blur(${blur}px) sepia(${sepia}%) grayscale(${grayscale}%)`;
  ctx.drawImage(img, 0, 0);
  return canvas;
}
