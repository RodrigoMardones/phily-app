const palette = require('./src/styles/palette');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
    './src/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        ink: palette.ink,
        herbarium: palette.herbarium,
        lichen: palette.lichen,
        parchment: palette.parchment,
        oxide: palette.oxide,
        signal: palette.signal,
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: palette.herbarium,
          'primary-content': palette.parchment,
          secondary: palette.signal,
          'secondary-content': '#ffffff',
          accent: palette.oxide,
          'accent-content': '#ffffff',
          neutral: palette.ink,
          'neutral-content': palette.parchment,
          'base-100': palette.parchment,
          'base-content': palette.ink,
          info: palette.signal,
          success: palette.herbarium,
          warning: palette.oxide,
          error: '#B23A48',
          'error-content': '#ffffff',
        },
      },
    ],
  },
  plugins: [require('daisyui'), require('tailwind-scrollbar')],
};
