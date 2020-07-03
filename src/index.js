import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'bootstrap';
import 'bootstrap-select/dist/js/bootstrap-select.min';
import 'bootstrap-select/dist/js/i18n/defaults-ru_RU.min';
import './css/index.scss';
import { initializeRouter, router } from './routes/index';
import { store } from './store';
import { API_USER } from './api/user';
import { Statistics } from './scripts/Statistics';
import { routesMap, routeKeys, PRELOADER } from './scripts/helpers/variables';

window.onload = async () => {
  await initRequests();
  PRELOADER.classList.add('preload-wrapper-hidden');
  initializeRouter();
};

export async function initRequests() {
  const { userId } = store.user.auth;
  if (!userId) {
    router.navigate(routesMap.get(routeKeys.login).url);
  } else {
    const userSettings = await API_USER.getUserSettings({ userId });
    store.user.learning = {
      ...store.user.learning,
      ...userSettings,
    };
  }
}

( async() => {
  const statistics = await Statistics.set({
    "learnedWords": 2034,
    "optional": {
      "short": {
        "day": new Date().toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' }),
        "cards": 20,
        "newWords": 10,
        "answers": 'WTTWTTTTWWWWW'
      },
      "long": {
        [new Date().toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' })]: 10,
        [new Date('07-06-2020').toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' })]: 20,
        [new Date('01-07-2020').toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' })]: 30,
      },
    }
  })

  Object.entries(statistics.optional).forEach(([key, value]) => {
    store.mainGame.statistics[key] = value;
  });
  store.mainGame.statistics.learnedWords = statistics.learnedWords;
})()
