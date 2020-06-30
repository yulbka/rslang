import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'bootstrap';
import 'bootstrap-select/dist/js/bootstrap-select.min';
import 'bootstrap-select/dist/js/i18n/defaults-ru_RU.min';
import './css/index.scss';
import { WordService } from './scripts/service/Word.Service';
import { initializeRouter, router } from './routes/index';
import { store } from './store';
import { API_USER } from './api/user';
import { routesMap, routeKeys, PRELOADER } from './scripts/helpers/variables';

window.onload = async () => {
  await initRequests();
    store.user.wordsToRepeat = [];
    const userWords = await WordService.getAllUserWords();
    const filteredWords = userWords
      .filter((word) => word.optional.category !== 'deleted')
      .filter((word) => {
        return new Date() - new Date(word.optional.nextDayRepeat) > 0;
      });
    await Promise.all(filteredWords.map((word) => WordService.getAggregatedWord(word.wordId))).then((results) => 
      results.forEach((word) => store.user.wordsToRepeat.push(word))
    );
  PRELOADER.classList.add('preload-wrapper-hidden')
  initializeRouter()
};

async function initRequests() {
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