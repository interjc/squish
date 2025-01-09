declare module 'gifsicle-wasm-browser' {
  export interface GifSicleInput {
    file: Uint8Array | ArrayBuffer;
    name: string;
  }

  export interface GifSicleOutput {
    data: Uint8Array;
    name: string;
  }

  export interface GifSicle {
    run(options: {
      input: GifSicleInput[];
      command: string[];
    }): Promise<GifSicleOutput[]>;
  }

  const gifsicle: {
    run(options: {
      input: GifSicleInput[];
      command: string[];
    }): Promise<GifSicleOutput[]>;
  };

  export default gifsicle;
}
