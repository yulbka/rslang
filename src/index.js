import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './css/index.scss';
import { store } from './store';
import { API_USER } from './api/user';

(async () => {
  const res = await API_USER.getUser({ userId: '5eea492edffad00017faa81c' });
  store.user = { ...store.user, ...res };
  console.log({ ...store });
})();
