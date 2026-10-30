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
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
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
        card: '16px',
      },
      boxShadow: {
        card: 'var(--card-shadow)',
        pop: 'var(--pop-shadow)',
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
