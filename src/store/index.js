import { audiocallGameSettings } from 'pages/games/audiocall';
import { userSettings } from './user';
import { statistics } from './statistics';

export const store = new Proxy(
  {
    user: userSettings,
    audiocallGame: audiocallGameSettings,
    statistics,
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
