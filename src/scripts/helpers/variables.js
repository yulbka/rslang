export const MAIN = document.querySelector('#main');
export const SIDEBAR = document.querySelector('#sidebar');
export const HEADER = document.querySelector('#header');
export const PRELOADER = document.querySelector('.preload-wrapper');

export const routesMap = new Map([
  ['game1', { url: '#0', title: 'Учи слова' }],
  ['progress', { url: '#1', title: 'Твой прогресс' }],
  ['vocabulary', { url: '#2', title: 'Твой словарь' }],
  ['speakit', { url: '#3', title: 'Произнеси слово' }],
  ['englishpuzzle', { url: '#4', title: 'Английский паззл' }],
  ['savannah', { url: '#5', title: 'Саванна' }],
  ['audio', { url: '#6', title: 'Аудиовызов' }],
  ['sprint', { url: '#7', title: 'Спринт' }],
  ['promo', { url: '#8', title: 'Промо' }],
  ['team', { url: '#9', title: 'Наша команда' }],
]);
