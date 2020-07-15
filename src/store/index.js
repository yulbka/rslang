import { userSettings } from './user';

export const store = new Proxy(
  {
    user: userSettings,
    game1: {},
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
