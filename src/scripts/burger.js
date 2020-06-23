import '../css/burger.scss';
import { createElement } from './helpers/createElement';
import { SIDEBAR, routesMap } from './helpers/variables';

export function createSidebar() {
  const aside = createElement('aside', SIDEBAR, ['root-sidebar']);
  const burger = createElement('div', aside, ['root-sidebar-burger']);
  const navigation = createElement('div', aside, ['root-sidebar-navigation']);
  const innerBurger = createElement('div', navigation, ['root-sidebar-innerBurger']);
  createElement('span', innerBurger);
  const ul = createElement('ul', navigation, ['main']);
  const about = createElement('div', navigation, ['about']);
  createElement(
    'p',
    about,
    undefined,
    'RS Lang – приложение для изучения иностранных слов с методикой интервального повторения, отслеживанием индивидуального прогресса и мини-играми.'
  );

  for (const value of routesMap.values()) {
    const li = createElement('li', ul);
    createElement('a', li, undefined, value.title, 'href', value.url);
  }

  createElement('span', burger, navigation, ul, about);
  SIDEBAR.appendChild(aside);

  function toggleBurger() {
    document.querySelector('.root-sidebar').classList.toggle('isOpen');
  }

  document.querySelector('.root-sidebar-burger').addEventListener('click', toggleBurger);
  document.querySelector('.root-sidebar-innerBurger').addEventListener('click', toggleBurger);
}
