import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'bootstrap';
import 'bootstrap-select/dist/js/bootstrap-select.min';
import 'bootstrap-select/dist/js/i18n/defaults-ru_RU.min';
import './css/index.scss';
import { initializeRouter, router } from './routes/index';
import { store } from './store';
import { API_USER } from './api/user';
import { routesMap, PRELOADER } from './scripts/helpers/variables';

window.onload = async () => {
  await initRequests();
  PRELOADER.classList.add('preload-wrapper-hidden')
  initializeRouter()
};

async function initRequests() {
  const { userId } = store.user.auth;
  if (!userId) {
    router.navigate(routesMap.get('login').url);
  } else {
    const userSettings = await API_USER.getUserSettings({ userId });
    store.user.learning = {
      ...store.user.learning,
      ...userSettings,
    };
  }
}
