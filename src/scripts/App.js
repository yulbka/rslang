import { SIDEBAR, MAIN } from './constants';
import { Authorization } from './Authorization';

export class App {
  static reRender(page) {
    if (page === 'login' || page === 'registration') {
      SIDEBAR.innerHTML = '';
    } else {
      this.checkSideBar();
    }
    MAIN.innerHTML = '';
    this.setContent(page);
  }

  static checkSideBar() {
    if (!SIDEBAR.innerHTML) {
      this.setContent('sidebar');
    }
  }

  static setContent(content) {
    switch (content) {
      case 'login':
      case 'registration':
        Authorization.render(content);
        break;
      case 'sidebar':
        SIDEBAR.innerHTML = '<div>sidebar</div>'; // replace with function that render sidebar
        break;
      case 'learn':
        MAIN.innerHTML = '<div>learn</div>'; // replace with function that render page learn words
        break;
      case 'progress':
        MAIN.innerHTML = '<div>progress</div>'; // replace with function that render progress page
        break;
      case 'dictionary':
        MAIN.innerHTML = '<div>dictionary</div>'; // replace with function that render dictionary page
        break;
      case 'speakIt':
        MAIN.innerHTML = '<div>speakIt</div>'; // replace with function that render speakIt mini-game page
        break;
      case 'puzzle':
        MAIN.innerHTML = '<div>puzzle</div>'; // replace with function that render puzzle mini-game page
        break;
      case 'savannah':
        MAIN.innerHTML = '<div>savannah</div>'; // replace with function that render savannah mini-game page
        break;
      case 'audioCall':
        MAIN.innerHTML = '<div>audioCall</div>'; // replace with function that render audioCall mini-game page
        break;
      case 'sprint':
        MAIN.innerHTML = '<div>sprint</div>'; // replace with function that render sprint mini-game page
        break;
      case 'ourGame':
        MAIN.innerHTML = '<div>ourGame</div>'; // replace with function that render ourGame mini-game page
        break;
      case 'promo':
        MAIN.innerHTML = '<div>promo</div>'; // replace with function that render promo page
        break;
      case 'aboutUs':
        MAIN.innerHTML = '<div>aboutUs</div>'; // replace with function that render aboutUs page
        break;
      default:
        MAIN.innerHTML = '<div>main</div><button type="button" class="btn btn-primary">Button</button>'; // replace with function that render main page
    }
  }
}
