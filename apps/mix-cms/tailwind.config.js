const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html,scss}'),
    ...createGlobPatternsForDependencies(__dirname),
    'libs/mix-share/**/!(*.stories|*.spec).{ts,html,scss}',
    'libs/mix-ui/**/!(*.stories|*.spec).{ts,html,scss}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        night: {
          50: '#e4e4eb',
          100: '#bbbace',
          200: '#8f8ead',
          300: '#66658c',
          400: '#4b4777',
          500: '#302a62',
          600: '#2b245b',
          700: '#241c51',
          800: '#1c1445',
          900: '#130030',
        },
      },
    },
    fontFamily: {
      poppins: ['Poppins', 'system-ui', 'sans-serif'],
      nunito: ['Nunito Sans', 'sans-serif'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
};
