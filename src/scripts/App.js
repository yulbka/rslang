import { SIDEBAR, MAIN, HEADER, routesMap, routeKeys } from 'scripts/helpers/variables';
import { pageHomeCreate } from 'pages/main';
import { store } from 'store';
import { audioCallGameCreate } from 'pages/games/audiocall';
import { aboutTeamCreate } from 'pages/aboutTeam';
import { create_dictionary } from './dictionary';
import { createSidebar } from './burger';
import { Header } from './Header';
import { Authorization } from './Authorization';
import { LearnWords } from './learn_words/learnWords';
import { router } from '../routes';
import { PuzzleStartPage } from '../pages/puzzle/StartPage';
import { Statistics } from './Statistics';
import { createa_promo_page } from './promo'
import { createSavannahGame } from '../games/savannah/js/mainApp';
import { renderSavannah } from '../games/savannah/js/render';
import { createSpeakItGame } from '../games/speakit/js/mainApp';
import { create_hangman2 } from './hangman2';
import { renderSpeakIt } from '../games/speakit/js/render';
import { renderSprint } from '../games/sprint/js/render';

export class App {
  static async reRender(page) {
    const isAuthPage = [routesMap.get(routeKeys.login).url, routesMap.get(routeKeys.registration).url].includes(page);
    const isAuthorized = !!store.user.auth.token;
    if (isAuthPage) {
      if (isAuthorized) return router.navigate(routesMap.get(routeKeys.home).url);
      SIDEBAR.innerHTML = '';
      HEADER.innerHTML = '';
    } else {
      this.checkSideBar();
      this.checkHeader();
    }
    MAIN.innerHTML = '';
    document.body.className = '';
    this.setContent(page);
  }

  static checkSideBar() {
    if (!SIDEBAR.innerHTML) {
      createSidebar();
    }
  }

  static checkHeader() {
    if (!HEADER.innerHTML) {
      Header.render();
    }
  }

  static setContent(url) {
    switch (url) {
      case '':
      case routesMap.get(routeKeys.home).url: {
        pageHomeCreate();
        break;
      }
      case routesMap.get(routeKeys.login).url:
      case routesMap.get(routeKeys.registration).url:
        Authorization.render(url);
        break;
      case routesMap.get(routeKeys.learn).url:
        LearnWords.init();
        break;
      case routesMap.get(routeKeys.progress).url:
        Statistics.renderLongPage();
        break;
      case routesMap.get(routeKeys.vocabulary).url:
        create_dictionary();
        break;
      case routesMap.get(routeKeys.speakIt).url:
        renderSpeakIt();
        createSpeakItGame();
        break;
      case routesMap.get(routeKeys.englishPuzzle).url:
        PuzzleStartPage.render();
        break;
      case routesMap.get(routeKeys.savannah).url:
        renderSavannah();
        createSavannahGame();
        break;
      case routesMap.get(routeKeys.audio).url:
        audioCallGameCreate();
        break;
      case routesMap.get(routeKeys.sprint).url:
        renderSprint();
        break;
      case routesMap.get(routeKeys.ourGame).url:
        create_hangman2();
        break;
      case routesMap.get(routeKeys.promo).url:
        createa_promo_page(); // replace with function that render promo page
        break;
      case routesMap.get(routeKeys.team).url:
        aboutTeamCreate();
        break;
      default:
        break;
    }
  }
}
