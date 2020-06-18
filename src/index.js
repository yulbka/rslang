import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './css/index.scss';
import { store } from './store';
import { API_USER } from './api/user';

//example
(async () => {
  const [user, userSettings] = await Promise.all([
    API_USER.getUser({ userId: '5eea492edffad00017faa81c' }),
    API_USER.getUserSettings({
      userId: '5eea492edffad00017faa81c',
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
