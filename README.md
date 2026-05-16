# Yellow Dots Decoder

## Overview

Yellow Dots Decoder is a web-based tool for decoding yellow dot patterns from images. Many color laser printers embed a **Machine Identification Code (MIC)**—a faint grid of yellow microdots—on each page; the live app includes an educational guide on [MIC and yellow dot decoding](https://yellow-dots-decoder.mathieurenaud.fr/#yellow-dots-guide).

The project allows you to:

- Upload an image.
- Process the image by removing red and green channels.
- Manually mark yellow dots on a grid.
- Decode the information stored in the dot pattern.
- Zoom and pan on the processed image for better visibility.

## Technologies Used

- **Vite** for dev server and production builds.
- **Tailwind CSS v4** (`@tailwindcss/vite`) and a shared design system (ambient background, theme tokens).
- **JavaScript (ES modules)** for grid interaction and decoding logic.
- **Jimp** (`jimp` on npm) for image processing in the browser.
- **Inter Variable** (`@fontsource-variable/inter`) for typography.

## How to Use

Use the tool here: [yellow-dots-decoder.mathieurenaud.fr](https://yellow-dots-decoder.mathieurenaud.fr)

1. Open the application in a browser.
2. Upload an image using the file input.
3. Adjust the zoom and pan to locate the yellow dot pattern.
4. Click on the grid to match the pattern.
5. View the decoded information below the grid.

## Installation & development

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Production build

```bash
npm run build
```

Static output is written to **`dist/`**. Deploy the contents of `dist/` to your host (same layout as the live site: `index.html`, hashed assets under `dist/assets/`, and files from `public/` such as `robots.txt` and `public/assets/*`).

Preview the build locally:

```bash
npm run preview
```

## Author

**Mathieu Renaud** - [Website](https://resume.mathieurenaud.fr/)

## License

This project is licensed under the MIT License.
