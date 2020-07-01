import { createElement } from './helpers/createElement';
import { HEADER } from './helpers/variables';
import { router } from '../routes/index';
import { store } from '../store/index';

export class Header {
  static render() {
    const fragment = document.createDocumentFragment();
    const header = createElement('header', fragment, ['header', 'text-white']);
    createElement('h1', header, ['header-title'], 'RSLang');
    createElement('button', header, ['logout']);
    HEADER.append(fragment);
    this.logoutHandler();
  }

  static logoutHandler() {
    const logoutBtn = document.querySelector('.logout');
    logoutBtn.addEventListener('click', () => {
      store.user.auth.token = null;
      router.navigate('login');
    });
  }
}
