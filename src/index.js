import 'core-js/stable';
import 'regenerator-runtime/runtime';
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
  //await auth()
  const userSettings = await API_USER.getUserSettings({
    userId: store.user.auth.userId,
  });

  store.user.learning = {
    ...store.user.learning,
    ...userSettings,
  };
}
