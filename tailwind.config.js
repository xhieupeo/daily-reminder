/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          bg: 'var(--color-canvas-bg, #1a192b)',
        },
        surface: {
          card: 'var(--color-surface-card, #26243d)',
          hover: 'var(--color-surface-hover, #332f52)',
          sunken: 'var(--color-surface-sunken, #131220)',
        },
        borderDark: 'var(--color-border-dark, #0d0c17)',
        sakura: {
          DEFAULT: '#f49ac2',
          light: '#f8b9d4',
          dark: '#d6759f',
        },
        matcha: {
          DEFAULT: '#8bd5ca',
          light: '#aae2d9',
          dark: '#6bb8ac',
        },
        pixelGold: {
          DEFAULT: '#f9c846',
          light: '#fbd872',
        },
        parchment: {
          DEFAULT: '#f6eedb',
          muted: '#9d96bd',
        },
        coral: {
          DEFAULT: '#ea7679',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        retro: ['VT323', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px #0d0c17',
        'pixel-sm': '2px 2px 0px 0px #0d0c17',
        'pixel-lg': '6px 6px 0px 0px #0d0c17',
        'pixel-btn': '3px 3px 0px 0px #0d0c17',
        'pixel-pressed': '1px 1px 0px 0px #0d0c17',
      },
    },
  },
  plugins: [],
}

