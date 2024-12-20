/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify';
import router from '@/router';
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faStar,
  faHeart,
  faShieldHalved,
  faForward,
  faMugSaucer,
  faLink,
  faShuffle,
} from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
library.add(faClock);
library.add(faStar, faHeart, faShieldHalved, faForward, faMugSaucer, faLink, faShuffle);
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
themeMediaQuery.addEventListener('change', (event) => {
  const newTheme = event.matches ? 'dark' : 'light';
  vuetify.theme.global.name.value = newTheme;
});

export function registerPlugins(app) {
  app.component('font-awesome-icon', FontAwesomeIcon);
  app.component('RecycleScroller', RecycleScroller);
  app.use(vuetify).use(router);
}
