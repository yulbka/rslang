import { SIDEBAR, MAIN } from './constants';
import { LearnWords } from './learn_words/LearnWords';

export class App {
  static reRender(page) {
    if (page === 'login') {
      SIDEBAR.innerHTML = '';
    } else {
      this.checkSideBar();
    }
    MAIN.innerHTML = '';
    this.setContent(page);
  }

  static checkSideBar() {
    if (!SIDEBAR.innerHTML) {
      SIDEBAR.innerHTML = this.setContent('sidebar');
    }
  }

  static setContent(content) {
    switch (content) {
      case 'login':
        return '<div>login</div>'; // replace with function that render authorization page
      case 'sidebar':
        return '<div>sidebar</div>'; // replace with function that render sidebar
      case 'learn':
        LearnWords.render();
        break;
      case 'progress':
        return '<div>progress</div>'; // replace with function that render progress page
      case 'dictionary':
        return '<div>dictionary</div>'; // replace with function that render dictionary page
      case 'speakIt':
        return '<div>speakIt</div>'; // replace with function that render speakIt mini-game page
      case 'puzzle':
        return '<div>puzzle</div>'; // replace with function that render puzzle mini-game page
      case 'savannah':
        return '<div>savannah</div>'; // replace with function that render savannah mini-game page
      case 'audioCall':
        return '<div>audioCall</div>'; // replace with function that render audioCall mini-game page
      case 'sprint':
        return '<div>sprint</div>'; // replace with function that render sprint mini-game page
      case 'ourGame':
        return '<div>ourGame</div>'; // replace with function that render ourGame mini-game page
      case 'promo':
        return '<div>promo</div>'; // replace with function that render promo page
      case 'aboutUs':
        return '<div>aboutUs</div>'; // replace with function that render aboutUs page
      default:
        return '<div>main</div><button type="button" class="btn btn-primary">Button</button>'; // replace with function that render main page
    }
  }
}
