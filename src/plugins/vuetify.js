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
          vocal: '#ff3366',
          'vocal-text-1': '#BB2352',
          'vocal-text-2': '#33081B',
          'vocal-bg-1': '#ff3366',
          'vocal-bg-2': '#FF6E9B',
          'vocal-bg-3': '#FFEAF3',
          dance: '#0066ff',
          'dance-text-1': '#0055BB',
          'dance-text-2': '#001D33',
          'dance-bg-1': '#0066ff',
          'dance-bg-2': '#4D9EFF',
          'dance-bg-3': '#E6F4FF',
          visual: '#ffcc00',
          'visual-text-1': '#BB8D00',
          'visual-text-2': '#332100',
          'visual-bg-1': '#ffcc00',
          'visual-bg-2': '#FFD34D',
          'visual-bg-3': '#FFF6E6',

          'text-1': '#222',
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

          'text-1': '#ccc',
          'border-1': '#333', // 暗い/メイン
          'border-2': '#999', // 明るい/内容など
          'bg-1': '#111', // 暗い/メイン
          'bg-2': '#444', // 明るい/サブ
        },
      },
    },
  },
});
