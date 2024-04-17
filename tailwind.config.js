/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
    './src/**/*.js',
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#004cff',
          secondary: '#00bb00',
          accent: '#00a4d1',
          neutral: '#040404',
          'base-100': '#ffffe3',
          info: '#00a0ff',
          success: '#87c900',
          warning: '#cb5200',
          error: '#df002a',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
}
