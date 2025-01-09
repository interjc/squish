export interface ImageFile {
  id: string;
  file: File;
  preview?: string;
  status: 'pending' | 'queued' | 'processing' | 'complete' | 'error';
  error?: string;
  originalSize: number;
  compressedSize?: number;
  outputType?: OutputType;
  blob?: Blob;
}

export type OutputType = 'avif' | 'jpeg' | 'jxl' | 'png' | 'webp' | 'gif';

export interface FormatQualitySettings {
  avif: number;
  jpeg: number;
  jxl: number;
  webp: number;
  gif: number;
}

export interface CompressionOptions {
  quality: number;
}
