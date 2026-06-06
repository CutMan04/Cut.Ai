# WCMB Cut.AI

A static website project hosted on Vercel with Speed Insights integration.

## Features

- **Vercel Speed Insights**: Automatically tracks web vitals and performance metrics
- Static content serving from the `/public` directory

## Project Structure

```
├── public/
│   ├── index.html           # Main HTML file with Speed Insights
│   └── WCMB-Kindle.mobi     # Kindle book file
├── package.json             # Project dependencies
├── pnpm-lock.yaml          # PNPM lock file
└── vercel.json             # Vercel configuration
```

## Speed Insights

This project uses [@vercel/speed-insights](https://www.npmjs.com/package/@vercel/speed-insights) to monitor website performance. The Speed Insights script is automatically loaded on every page and tracks Core Web Vitals metrics.

### How it works

1. The `window.si` queue is initialized in the HTML head
2. The Speed Insights script is loaded from `/_vercel/speed-insights/script.js`
3. Performance data is automatically collected and sent to Vercel
4. View metrics in your [Vercel Dashboard](https://vercel.com/dashboard)

### Enabling Speed Insights

To view the analytics:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select this project
3. Navigate to the "Speed Insights" tab
4. Click "Enable" if not already enabled

## Development

This is a static site with no build process required.

### Installation

```bash
pnpm install
```

### Local Development

Since this is a static site, you can serve it using any static file server:

```bash
# Using Python
python -m http.server 3000 --directory public

# Using Node.js serve
npx serve public

# Using Vercel CLI
vercel dev
```

## Deployment

This project is configured for deployment on Vercel. It will automatically deploy when pushed to the main branch.

```bash
# Deploy to Vercel
vercel deploy
```

## Dependencies

- `@vercel/speed-insights`: ^1.1.0 - Performance monitoring for Vercel projects

## License

All rights reserved.
