import { store } from 'store';
import { SIDEBAR, MAIN, routesMap, routeKeys } from 'scripts/helpers/variables';
import { pageHomeCreate } from 'pages/main';
import { createSidebar } from './burger';
import { Authorization } from './Authorization';
import { router } from '../routes';

export class App {
  static reRender(page) {
    const isAuthPage = [routesMap.get(routeKeys.login).url, routesMap.get(routeKeys.registration).url].includes(page);
    const isAuthorized = !!store.user.auth.token;

    if (isAuthPage) {
      if (isAuthorized) return router.navigate(routesMap.get(routeKeys.home).url);
      SIDEBAR.innerHTML = '';
    } else {
      this.checkSideBar();
    }
    MAIN.innerHTML = '';
    this.setContent(page);
  }

  static checkSideBar() {
    if (!SIDEBAR.innerHTML) {
      createSidebar();
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
      case routesMap.get(routeKeys.game1).url:
        MAIN.innerHTML = '<div>learn</div>'; // replace with function that render page learn words
        break;
      case routesMap.get(routeKeys.progress).url:
        MAIN.innerHTML = '<div>progress</div>'; // replace with function that render progress page
        break;
      case routesMap.get(routeKeys.vocabulary).url:
        MAIN.innerHTML = '<div>vocabulary</div>'; // replace with function that render dictionary page
        break;
      case routesMap.get(routeKeys.speakIt).url:
        MAIN.innerHTML = '<div>speakIt</div>'; // replace with function that render speakIt mini-game page
        break;
      case routesMap.get(routeKeys.englishPuzzle).url:
        MAIN.innerHTML = '<div>puzzle</div>'; // replace with function that render puzzle mini-game page
        break;
      case routesMap.get(routeKeys.savannah).url:
        MAIN.innerHTML = '<div>savannah</div>'; // replace with function that render savannah mini-game page
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
