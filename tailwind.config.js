/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
    './src/styles/**/*.{js,ts,jsx,tsx,css}',
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
  ],
  content: [
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
    './src/**/*.js',
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#498BCA',
          secondary: '#4CBFB7',
          accent: '#4CBFB7',
          neutral: 'FAEECC',
          'base-100': '#ffffe3',
          info: '#00a0ff',
          success: '#87c900',
          warning: '#cb5200',
          error: '#DE6F81',
          'primary-light': '6DA2D4',
        },
      },
    ],
  },
  plugins: [require('daisyui'), require('tailwind-scrollbar')],
};
