import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './css/index.scss';
import { router } from './routes/index';
import { store } from './store';
import { API_USER } from './api/user';
import { createSettingsBlock, createButtonToLearningWords, createBlockWithGames } from './pages/main';
import { gamesMap, PRELOADER } from './scripts/helpers/variables';

API_USER.getUser({ userId: localStorage.getItem('userId') })
    .then((data) => {
      if (data) {
        router.navigate('/');
      }
    })
    .finally(() => PRELOADER.classList.add('preload-wrapper-hidden'));


window.onload = async () => {
  await initRequests();
  createButtonToLearningWords();
  createSettingsBlock();
  createBlockWithGames({ gamesData: gamesMap });
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

//example
(async () => {
  const [user, userSettings] = await Promise.all([
    API_USER.getUser({ userId: store.user.auth.userId, }),
    API_USER.getUserSettings({
      userId: store.user.auth.userId,
    }),
  ]);

  Object.entries(user).forEach(([key, value]) => {
    store.user.auth[key] = value;
  });

  Object.entries(userSettings).forEach(([key, value]) => {
    store.user.learning[key] = value;
  });

  /*API_USER.setUserSettings({
        userId: '5eea492edffad00017faa81c',
        userSettings: {
            "wordsPerDay": 551,  // must be less than or equal to 1000
            "optional": {
                "translation": true,
                "withExplanation": false,
                "withExample": false,
                "transcription": true,
                "image": false
            }
        }
    });*/

  console.log('usr', { ...store });
})();