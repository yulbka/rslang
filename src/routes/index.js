import Navigo from 'navigo'
import { App } from '../scripts/App';

const root = null;
const useHash = true;
const hash = '#';

export const router = new Navigo(root, useHash, hash);

export function initializeRouter() {
    router
        .on({
            '/': () => {
                App.reRender('/');
            },
            login: () => {
                App.reRender('login');
            },
            registration: () => {
                App.reRender('registration');
            },
            learn: () => {
                App.reRender('learn');
            },
            progress: () => {
                App.reRender('progress');
            },
            dictionary: () => {
                App.reRender('dictionary');
            },
            '/games/speakIt': () => {
                App.reRender('speakIt');
            },
            '/games/englishPuzzle': () => {
                App.reRender('puzzle');
            },
            '/games/savannah': () => {
                App.reRender('savannah');
            },
            '/games/audioCall': () => {
                App.reRender('audioCall');
            },
            '/games/sprint': () => {
                App.reRender('sprint');
            },
            '/games/ourGame': () => {
                // replace route according to name of our game
                App.reRender('ourGame');
            },
            promo: () => {
                App.reRender('promo');
            },
            aboutUs: () => {
                App.reRender('aboutUs');
            },
        })
        .resolve();

router.notFound(() => {
  router.navigate('/');
});
