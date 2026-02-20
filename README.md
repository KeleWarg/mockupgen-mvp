# Device Mockup Composer

3D device mockup composer for editorial presentations. Upload screenshots into realistic iPad and iPhone frames with customizable backgrounds, 3D perspective, and lighting overlays.

## Project Structure

```
mockup-composer/
├── public/
│   ├── index.html      ← Main HTML
│   ├── styles.css      ← All styles
│   └── app.js          ← All interactivity
├── package.json
├── vercel.json         ← Vercel deploy config
└── README.md
```

## Local Development

```bash
# Install serve (one-time)
npm install -g serve

# Run locally
npm run dev
# → http://localhost:3000
```

Or just open `public/index.html` directly in a browser.

## Deploy to Vercel

```bash
# Install Vercel CLI (one-time)
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

The `vercel.json` is already configured to serve from `public/`.

## Deploy to Netlify

Drag the `public/` folder into [Netlify Drop](https://app.netlify.com/drop), or:

```bash
# Via CLI
npx netlify-cli deploy --dir=public --prod
```

## Features

- **5 background presets** via Unsplash + custom upload
- **Background positioning** — drag to pan, scroll to zoom, slider fine-tune
- **3D perspective** — 6 presets (Flat, Subtle, Editorial, Dramatic, Hero, Spread)
- **Per-device rotation** — independent X/Y controls for each device
- **3 devices** — iPad Portrait, iPhone 15 Pro, iPad Landscape
- **Realistic frames** — metal chamfer, side buttons, Dynamic Island, front cameras
- **Space Gray / Silver** device colors
- **Small / Medium / Large** device sizing
- **Light overlays** — window bands, vignette, warm light
- **Right-click → Save Image** to export for slides
