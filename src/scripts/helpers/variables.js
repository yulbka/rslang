export const MAIN = document.querySelector('#main');
export const SIDEBAR = document.querySelector('#sidebar');
export const PRELOADER = document.querySelector('.preload-wrapper');

export const routesMap = new Map([
  ['registration', { url: 'registration' }],
  ['login', { url: 'login' }],
  ['home', { url: '/' }],
  ['game1', { url: '#0', title: 'Учи слова' }],
  ['progress', { url: '#1', title: 'Твой прогресс' }],
  ['vocabulary', { url: '#2', title: 'Твой словарь' }],
  [
    'speakit',
    { url: '#3', title: 'Произнеси слово', preview: require('../../assets/img/content/speakIt.png').default },
  ],
  [
    'englishpuzzle',
    { url: '#4', title: 'Английский пазл', preview: require('../../assets/img/content/speakIt.png').default },
  ],
  ['savannah', { url: '#5', title: 'Саванна', preview: require('../../assets/img/content/savannah.jpg').default }],
  ['audio', { url: '#6', title: 'Аудиовызов', preview: require('../../assets/img/content/audiocall.jpg').default }],
  ['sprint', { url: '#7', title: 'Спринт', preview: require('../../assets/img/content/sprint.png').default }],
  ['ourGame', { url: '#', title: 'Наша игра', preview: require('../../assets/img/content/speakIt.png').default }],
  ['promo', { url: '#8', title: 'Промо' }],
  ['team', { url: '#9', title: 'Наша команда' }],
]);

export const sidebarMap = [
  'game1',
  'progress',
  'vocabulary',
  'speakit',
  'englishpuzzle',
  'savannah',
  'audio',
  'sprint',
  'promo',
  'team',
].map((key) => routesMap.get(key));

export const gamesMap = ['speakit', 'englishpuzzle', 'savannah', 'audio', 'sprint', 'ourGame'].map((key) =>
  routesMap.get(key)
);
