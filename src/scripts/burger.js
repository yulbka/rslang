import '../css/burger.scss';
import { createElement } from './helpers/createElement';
import { linksText, linksTextTeam, hrefs, hrefsTeam, SIDEBAR } from './helpers/variables';

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
  const ulteam = createElement('ul', navigation, ['team']);

  for (let index = 0; index < hrefs.length; index++) {
    const li = createElement('li', ul);
    createElement('a', li, undefined, `${linksText[index]}`, 'href', `${hrefs[index]}`);
  }
  for (let index = 0; index < hrefsTeam.length; index++) {
    const li = createElement('li', ulteam);
    createElement('a', li, undefined, `${linksTextTeam[index]}`, 'href', `${hrefsTeam[index]}`);
  }
  createElement('span', burger, navigation, ul, about);
  SIDEBAR.appendChild(aside);

  function toggleBurger() {
    document.querySelector('.root-sidebar').classList.toggle('isOpen');
  }

  document.querySelector('.root-sidebar-burger').addEventListener('click', toggleBurger);
  document.querySelector('.root-sidebar-innerBurger').addEventListener('click', toggleBurger);
}
