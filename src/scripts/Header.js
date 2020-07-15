import { createElement } from './helpers/createElement';
import { HEADER, routeKeys, routesMap } from './helpers/variables';
import { router } from '../routes/index';
import { store } from '../store/index';

export class Header {
  static render() {
    const fragment = document.createDocumentFragment();
    const header = createElement('header', fragment, ['header', 'text-white']);
    const link = createElement('a', header, ['header-link'], '', 'href', '#/');
    createElement('h1', link, ['header-title'], 'RSLang');
    createElement('button', header, ['logout']);
    HEADER.append(fragment);
    this.logoutHandler();
  }

  static logoutHandler() {
    const logoutBtn = document.querySelector('.logout');
    logoutBtn.addEventListener('click', () => {
      store.user.auth.token = null;
      localStorage.removeItem('token');
      store.user.auth.userId = null;
      localStorage.removeItem('userId');
      router.navigate(routesMap.get(routeKeys.login).url);
    });
  }
}
