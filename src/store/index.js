import { audiocallGameSettings } from 'pages/games/audiocall';
import { userSettings } from './user';
import { mainGame } from './mainGame';
export const store = new Proxy(
  {
    user: userSettings,
    mainGame,
    audiocallGame: audiocallGameSettings,
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
