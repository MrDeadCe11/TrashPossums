const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
     brown:{
       dark: '#2c1704',
       light: '#6d5934'
     },
     yellow: {
       dark: '#847f55',
       light: '#dad186'
     },
     gray:{
       dark: '#1d262d',
       light: '#242e37'
     },
      white: {
        light: '#e3e9e9'
      },
      black: {
        dark: '#000000'
      },
      blue: {
        dark: '#418bca',
        light: '#6ca6d4'
      }
    },
   
  },
}