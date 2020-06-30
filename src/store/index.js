import { userSettings } from './user';

export const store = new Proxy(
  {
    user: userSettings,
    mainGame: {
      statistics: {
        learnedWords: 0,
        short: {
          cards: 0,
          newWords: 0,
          answers: '',
        },
        long: {
          
        },
      }
    },
  },
  {
    set(target, name, value) {
      // eslint-disable-next-line no-param-reassign
      target[name] = value;

      switch (name) {
        case 'someKey': {
          // renderSomething();
          break;
        }

        default:
          break;
      }

      return true;
    },
  }
);
