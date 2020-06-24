import { createElement } from './helpers/createElement';
import { LOGOUT } from './helpers/variables';
import { router } from '../routes/index';

function renderLogout() {
  const fragment = document.createDocumentFragment();
  const header = createElement('header', fragment, ['header', 'text-white']);
  createElement('h1', header, ['header-title'], 'RSLang');
  createElement('div', header, ['logout']);
  LOGOUT.append(fragment);
}

export function createLogout() {
  renderLogout();
  const logoutBtn = document.querySelector('.logout');
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    router.navigate('login');
  })
}