import { App } from '../js/App';

const root = null;
const useHash = true;
const hash = '#';
const { Navigo } = window;

export const router = new Navigo(root, useHash, hash);

router
  .on({
    '/': function f() {
      App.reRender();
    },
    login: function f() {
      App.reRender('login');
    },
    learn: function f() {
      App.reRender('learn');
    },
    progress: function f() {
      App.reRender('progress');
    },
    dictionary: function f() {
      App.reRender('dictionary');
    },
    '/games/speakIt': function f() {
      App.reRender('speakIt');
    },
    '/games/englishPuzzle': function f() {
      App.reRender('puzzle');
    },
    '/games/savannah': function f() {
      App.reRender('savannah');
    },
    '/games/audioCall': function f() {
      App.reRender('audioCall');
    },
    '/games/sprint': function f() {
      App.reRender('sprint');
    },
    '/games/ourGame': function f() {
      // replace route according to name of our game
      App.reRender('ourGame');
    },
    promo: function f() {
      App.reRender('promo');
    },
    aboutUs: function f() {
      App.reRender('aboutUs');
    },
  })
  .resolve();

router.notFound(function f() {
  router.navigate('/');
});
