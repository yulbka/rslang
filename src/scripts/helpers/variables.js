export const MAIN = document.querySelector('#main');
export const SIDEBAR = document.querySelector('#sidebar');
export const HEADER = document.querySelector('#header');
export const PRELOADER = document.querySelector('.preload-wrapper');

export const routeKeys = {
  registration: 'registration',
  login: 'login',
  home: 'home',
  game1: 'game1',
  progress: 'progress',
  vocabulary: 'vocabulary',
  speakIt: 'speakIt',
  englishPuzzle: 'englishPuzzle',
  savannah: 'savannah',
  audio: 'audio',
  sprint: 'sprint',
  ourGame: 'ourGame',
  promo: 'promo',
  team: 'team',
};

export const routesMap = new Map([
  [routeKeys.registration, { url: '#/registration' }],
  [routeKeys.login, { url: '#/login' }],
  [routeKeys.home, { url: '#/' }],
  [routeKeys.game1, { url: '#/games/game1', title: 'Учи слова' }],
  [routeKeys.progress, { url: '#/progress', title: 'Твой прогресс' }],
  [routeKeys.vocabulary, { url: '#/vocabulary', title: 'Твой словарь' }],
  [
    routeKeys.speakIt,
    { url: '#/games/speakit', title: 'Произнеси слово', preview: require('assets/img/content/speakIt.png').default },
  ],
  [
    routeKeys.englishPuzzle,
    {
      url: '#/games/englishPuzzle',
      title: 'Английский пазл',
      preview: require('assets/img/content/speakIt.png').default,
    },
  ],
  [
    routeKeys.savannah,
    { url: '#/games/savannah', title: 'Саванна', preview: require('assets/img/content/savannah.jpg').default },
  ],
  [
    routeKeys.audio,
    { url: '#/games/audio', title: 'Аудиовызов', preview: require('assets/img/content/audiocall.jpg').default },
  ],
  [
    routeKeys.sprint,
    { url: '#/games/sprint', title: 'Спринт', preview: require('assets/img/content/sprint.png').default },
  ],
  [
    routeKeys.ourGame,
    { url: '#/games/ourGame', title: 'Наша игра', preview: require('assets/img/content/speakIt.png').default },
  ],
  [routeKeys.promo, { url: '#/promo', title: 'Промо' }],
  [routeKeys.team, { url: '#/team', title: 'Наша команда' }],
]);

export const sidebarMap = [
  routeKeys.game1,
  routeKeys.progress,
  routeKeys.vocabulary,
  routeKeys.speakIt,
  routeKeys.englishPuzzle,
  routeKeys.savannah,
  routeKeys.audio,
  routeKeys.sprint,
  routeKeys.promo,
  routeKeys.team,
].map((key) => routesMap.get(key));

export const gamesMap = [
  routeKeys.speakIt,
  routeKeys.englishPuzzle,
  routeKeys.savannah,
  routeKeys.audio,
  routeKeys.sprint,
  routeKeys.ourGame,
].map((key) => routesMap.get(key));
