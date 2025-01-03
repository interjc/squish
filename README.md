# Squish 🎨

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A modern, browser-based image compression tool that leverages WebAssembly for high-performance image optimization. Squish supports multiple formats and provides an intuitive interface for compressing your images without compromising quality.

![](https://image-compress-azure.vercel.app/meta.jpg)

## ✨ Features

- 🖼️ Support for multiple image formats:
  - AVIF (AV1 Image Format)
  - JPEG (using MozJPEG)
  - JPEG XL
  - PNG (using OxiPNG)
  - WebP

- 🚀 Key capabilities:
  - Browser-based compression (no server uploads needed)
  - Batch processing support
  - Format conversion
  - Quality adjustment per format
  - Real-time preview
  - Size reduction statistics
  - Drag and drop interface
  - Smart queue for compressing large number of files

## 🛠️ Technology

Squish is built with modern web technologies:

- React + TypeScript for the UI
- Vite for blazing fast development
- WebAssembly for native-speed image processing
- Tailwind CSS for styling
- jSquash for image codec implementations

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or later
- npm 7 or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yatingodse/squish.git
cd squish
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 💡 Usage

1. **Drop or Select Images**: Drag and drop images onto the upload area or click to select files
2. **Choose Output Format**: Select your desired output format (AVIF, JPEG, JPEG XL, PNG, or WebP)
3. **Adjust Quality**: Use the quality slider to balance between file size and image quality
4. **Download**: Download individual images or use the "Download All" button for batch downloads

## 🔧 Default Quality Settings

- AVIF: 50%
- JPEG: 75%
- JPEG XL: 75%
- PNG: Lossless
- WebP: 75%

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [jSquash](https://github.com/jamsinclair/jSquash) for the WebAssembly image codecs
- [MozJPEG](https://github.com/mozilla/mozjpeg) for JPEG compression
- [libavif](https://github.com/AOMediaCodec/libavif) for AVIF support
- [libjxl](https://github.com/libjxl/libjxl) for JPEG XL support
- [Oxipng](https://github.com/shssoichiro/oxipng) for PNG optimization
