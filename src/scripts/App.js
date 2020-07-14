import { SIDEBAR, MAIN, HEADER, routesMap, routeKeys } from 'scripts/helpers/variables';
import { pageHomeCreate } from 'pages/main';
import { store } from 'store';
import {create_dictionary} from './dictionary'
import { createSidebar } from './burger';
import { Header } from './Header';
import { Authorization } from './Authorization';
import { LearnWords } from './learn_words/learnWords';
import { router } from '../routes';
import { PuzzleStartPage } from '../pages/puzzle/StartPage';
import { Statistics } from './Statistics';
import { createSavannahGame } from '../games/savannah/js/mainApp';
import { renderSavannah } from '../games/savannah/js/render';
import { createSpeakItGame } from '../games/speakit/js/mainApp';
import { renderSpeakIt } from '../games/speakit/js/render';

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
    document.body.classList.remove('main-page');
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
        create_dictionary(); // replace with function that render dictionary page
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
        MAIN.innerHTML = '<div>audioCall</div>'; // replace with function that render audioCall mini-game page
        break;
      case routesMap.get(routeKeys.sprint).url:
        MAIN.innerHTML = '<div>sprint</div>'; // replace with function that render sprint mini-game page
        break;
      case routesMap.get(routeKeys.ourGame).url:
        MAIN.innerHTML = '<div>ourGame</div>'; // replace with function that render ourGame mini-game page
        break;
      case routesMap.get(routeKeys.promo).url:
        MAIN.innerHTML = '<div>promo</div>'; // replace with function that render promo page
        break;
      case routesMap.get(routeKeys.team).url:
        MAIN.innerHTML = '<div>aboutUs</div>'; // replace with function that render aboutUs page
        break;
      default:
        break;
    }
  }
}
