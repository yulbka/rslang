import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './css/index.scss';
import { router } from './routes/index';
import { store } from './store';
import { API_USER } from './api/user';
import { PRELOADER } from './scripts/helpers/variables';
import { WordService } from './scripts/service/Word.Service';

API_USER.getUser({ userId: localStorage.getItem('userId') })
  .then((data) => {
    if (data) {
      router.navigate('learn');
    }
  })
  .finally(async () => {
    store.user.wordsToRepeat = [];
    const userWords = await WordService.getAllUserWords();
    const filteredWords = userWords.filter((word) => {
      return new Date() - new Date(word.optional.nextDayRepeat) > 0;
    });
    await Promise.all(filteredWords.map((word) => WordService.getAggregatedWord(word.wordId)))
    .then((results) =>
      results.forEach((word) => store.user.wordsToRepeat.push(word[0]))
    );
    PRELOADER.classList.add('preload-wrapper-hidden');
  });

//example

(async () => {
  const [user, userSettings] = await Promise.all([
    API_USER.getUser({ userId: store.user.auth.userId }),
    API_USER.getUserSettings({
      userId: store.user.auth.userId,
    }),
  ]);
  console.log(user);

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
