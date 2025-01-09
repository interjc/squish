import * as avif from '@jsquash/avif';
import * as jpeg from '@jsquash/jpeg';
import * as jxl from '@jsquash/jxl';
import * as png from '@jsquash/png';
import * as webp from '@jsquash/webp';
import gifsicle from 'gifsicle-wasm-browser';
import type { OutputType, CompressionOptions } from '../types';
import type { AvifEncodeOptions, JpegEncodeOptions, JxlEncodeOptions, WebpEncodeOptions } from '../types/encoders';
import { ensureWasmLoaded } from './wasm';

async function decodeGif(fileBuffer: ArrayBuffer): Promise<ImageData> {
  // Convert ArrayBuffer to Blob
  const blob = new Blob([fileBuffer], { type: 'image/gif' });
  const url = URL.createObjectURL(blob);

  // Create an image element and load the GIF
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Create a canvas to draw the GIF
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Set canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);

      // Get the image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Clean up
      URL.revokeObjectURL(url);

      resolve(imageData);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load GIF image'));
    };

    img.src = url;
  });
}

async function encodeGif(imageData: ImageData, options: CompressionOptions): Promise<ArrayBuffer> {
  // Convert ImageData to GIF first
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);

  // Convert canvas to blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) {
        resolve(b);
      } else {
        reject(new Error('Failed to create blob from canvas'));
      }
    }, 'image/gif');
  });

  // Convert blob to ArrayBuffer
  const buffer = await blob.arrayBuffer();

  try {
    // Optimize the GIF using gifsicle
    const result = await gifsicle.run({
      input: [{
        file: buffer,
        name: 'input.gif'
      }],
      command: [
        '--optimize=3',
        `--lossy=${Math.round((100 - options.quality) / 2)}`,
        '--colors=256',
        'input.gif',
        '-o',
        'output.gif'
      ]
    });

    return result[0].data.buffer;
  } catch (error) {
    console.error('Failed to optimize GIF:', error);
    // If optimization fails, return the original buffer
    return buffer;
  }
}

export async function decode(sourceType: string, fileBuffer: ArrayBuffer): Promise<ImageData> {
  try {
    switch (sourceType) {
      case 'avif':
        await ensureWasmLoaded('avif');
        return await avif.decode(fileBuffer);
      case 'jpeg':
      case 'jpg':
        await ensureWasmLoaded('jpeg');
        return await jpeg.decode(fileBuffer);
      case 'gif':
        return await decodeGif(fileBuffer);
      case 'jxl':
        await ensureWasmLoaded('jxl');
        return await jxl.decode(fileBuffer);
      case 'png':
        await ensureWasmLoaded('png');
        return await png.decode(fileBuffer);
      case 'webp':
        await ensureWasmLoaded('webp');
        return await webp.decode(fileBuffer);
      default:
        throw new Error(`Unsupported source type: ${sourceType}`);
    }
  } catch (error) {
    console.error(`Failed to decode ${sourceType} image:`, error);
    throw new Error(`Failed to decode ${sourceType} image`);
  }
}

export async function encode(outputType: OutputType, imageData: ImageData, options: CompressionOptions): Promise<ArrayBuffer> {
  try {
    switch (outputType) {
      case 'avif': {
        await ensureWasmLoaded('avif');
        const avifOptions = {
          quality: options.quality,
          effort: 4 // Medium encoding effort
        } as unknown as AvifEncodeOptions;
        return await avif.encode(imageData, avifOptions);
      }
      case 'jpeg': {
        await ensureWasmLoaded('jpeg');
        const jpegOptions = {
          quality: options.quality
        } as unknown as JpegEncodeOptions;
        return await jpeg.encode(imageData, jpegOptions);
      }
      case 'jxl': {
        await ensureWasmLoaded('jxl');
        const jxlOptions = {
          quality: options.quality
        } as unknown as JxlEncodeOptions;
        return await jxl.encode(imageData, jxlOptions);
      }
      case 'png':
        await ensureWasmLoaded('png');
        return await png.encode(imageData);
      case 'webp': {
        await ensureWasmLoaded('webp');
        const webpOptions = {
          quality: options.quality
        } as unknown as WebpEncodeOptions;
        return await webp.encode(imageData, webpOptions);
      }
      case 'gif': {
        return await encodeGif(imageData, options);
      }
      default:
        throw new Error(`Unsupported output type: ${outputType}`);
    }
  } catch (error) {
    console.error(`Failed to encode to ${outputType}:`, error);
    throw new Error(`Failed to encode to ${outputType}`);
  }
}

export function getFileType(file: File): string {
  if (file.name.toLowerCase().endsWith('jxl')) return 'jxl';
  const type = file.type.split('/')[1];
  return type === 'jpeg' ? 'jpg' : type;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
