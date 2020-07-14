import { MAIN } from '../../scripts/helpers/variables';
import { createElement } from '../../scripts/helpers/createElement';
import { Game } from './Game';
import { GamePage } from './GamePage';

export class PuzzleStartPage {
  static render() {
    const fragment = document.createDocumentFragment();
    const wrapper = createElement('div', fragment, ['start__wrapper']);
    createElement('h2', wrapper, ['start__title', 'text-dark'], 'английский пазл');
    ['Нажимай на слова, собирай предложения.', 'Слова можно перетаскивать.', 'Выбирай подсказки'].forEach(
      (sentence) => {
        createElement('p', wrapper, ['start__description', 'text-dark'], `${sentence}`);
      }
    );
    createElement('button', wrapper, ['btn', 'btn-primary', 'start__button'], 'Начать');
    MAIN.append(fragment);
    this.startHandler();
  }

  static startHandler() {
    const startBtn = document.querySelector('.start__button');
    startBtn.addEventListener('click', () => {
      MAIN.innerHTML = '';
      GamePage.render();
      Game.init();
    });
  }
}
