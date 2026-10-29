import type { Config } from 'tailwindcss'

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      colors: {
        ink: token('ink'),
        panel: token('panel'),
        raised: token('raised'),
        fg: token('fg'),
        'fg-2': token('fg-2'),
        'fg-3': token('fg-3'),
        line: token('line'),
        accent: token('accent'),
        pos: token('pos'),
        neg: token('neg'),
        warn: token('warn'),
        msxi: token('msxi'),
      },
      borderRadius: {
        tile: '6px',
        card: '14px',
      },
      boxShadow: {
        // Shadows tinted with the warm ground instead of pure black.
        card: '0 1px 0 0 rgb(255 248 235 / 0.04) inset, 0 12px 32px -16px rgb(8 6 3 / 0.7)',
        pop: '0 1px 0 0 rgb(255 248 235 / 0.06) inset, 0 24px 48px -12px rgb(8 6 3 / 0.8)',
      },
      zIndex: {
        nav: '30',
        pop: '40',
        overlay: '50',
      },
    },
  },
  plugins: [],
}

export default config
