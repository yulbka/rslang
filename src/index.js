import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './css/index.scss';
import { API_USER } from './api/user';
import { createSettingsBlock } from './pages/main';
import { store } from './store';

window.onload = async () => {
  await initRequests();

  createSettingsBlock();
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
// (async () => {
//   const user = await API_USER.getUser({ userId: '5eea492edffad00017faa81c' })
//   Object.entries(user).forEach(([key, value]) => {
//     store.user.auth[key] = value;
//   });
// })();
