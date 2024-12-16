/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Composables
import { createVuetify } from 'vuetify';
import colors from 'vuetify/util/colors';

// システム設定に基づいてデフォルトテーマを設定
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const defaultTheme = prefersDarkMode ? 'dark' : 'light';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme,
    themes: {
      light: {
        colors: {
          vocal: '#f13584',
          'vocal-text-1': '#E00F69',
          'vocal-text-2': '#B00C53',
          'vocal-bg-1': '#f13584',
          'vocal-bg-2': '#F791BD',
          'vocal-bg-3': '#FDE7F0',
          dance: '#1d84ed',
          'dance-text-1': '#106BC6',
          'dance-text-2': '#0C5196',
          'dance-bg-1': '#1d84ed',
          'dance-bg-2': '#7AB7F4',
          'dance-bg-3': '#E7F2FD',
          visual: '#f7b12f',
          'visual-text-1': '#E69809',
          'visual-text-2': '#B57807',
          'visual-bg-1': '#ffcc00',
          'visual-bg-2': '#FAD48E',
          'visual-bg-3': '#FDF5E6',

          'green-1': '#76FF03',
          'yellow-1': '#FFEA00',
          'blue-1': '#84ffff',

          'text-1': '#222',
          'text-2': '#fff',
          'border-1': '#eee', // 明るい/メイン
          'border-2': '#aaa', // 暗い/内容など
          'bg-1': '#fcfcfc', // 明るい/メイン
          'bg-2': '#ddd', // 暗い/サブ
        },
      },
      dark: {
        colors: {
          vocal: '#BB2352',
          'vocal-text-1': '#FF6796',
          'vocal-text-2': '#FF9DC1',
          'vocal-bg-1': '#BB2352',
          'vocal-bg-2': '#771539',
          'vocal-bg-3': '#771539',
          dance: '#0055BB',
          'dance-text-1': '#4499FF',
          'dance-text-2': '#88C5FF',
          'dance-bg-1': '#0055BB',
          'dance-bg-2': '#003D77',
          'dance-bg-3': '#003D77',
          visual: '#BB8D00',
          'visual-text-1': '#FFD144',
          'visual-text-2': '#FFDC88',
          'visual-bg-1': '#BB8D00',
          'visual-bg-2': '#775400',
          'visual-bg-3': '#775400',

          'green-1': '#64DD17',
          'yellow-1': '#FFAB00',
          'blue-1': '#00ACC1',

          'text-1': '#ddd',
          'text-2': '#eee',
          'border-1': '#333', // 暗い/メイン
          'border-2': '#999', // 明るい/内容など
          'bg-1': '#111', // 暗い/メイン
          'bg-2': '#444', // 明るい/サブ
        },
      },
    },
  },
});
