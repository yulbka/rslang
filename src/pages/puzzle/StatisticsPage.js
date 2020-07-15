import { GamePage } from './GamePage';
import { createElement } from '../../scripts/helpers/createElement';
import { MAIN } from '../../scripts/helpers/variables';
import { Game } from './Game';
import { Statistics } from '../../scripts/Statistics';

export class StatisticsPage {
  static async init() {
    await this.render();
    this.continue();
  }

  static async render() {
    const fragment = document.createDocumentFragment();
    const container = createElement('div', fragment, ['statistic__container', 'container']);
    const statistics = await Statistics.get();
    if (!statistics) {
      createElement('p', container, ['info'], 'Statistics are temporarily unavailable');
    } else {
      for (const [round, value] of Object.entries(statistics.optional.englishPuzzle.long)) {
        const p = createElement('p', container, ['statistic__text', 'text-center']);
        createElement('span', p, ['text-info'], `${round}: `);
        createElement('span', p, ['text-success'], `${10 - value.mistakes}`);
        createElement('span', p, ['text-dark'], '/10');
      }
    }
    const buttons = createElement('div', fragment, ['statistic__buttons', 'justify-content-center', 'flex-row']);
    createElement('button', buttons, ['btn', 'btn-primary', 'puzzle-btn', 'button_continue'], 'Продолжить');
    MAIN.append(fragment);
  }

  static continue() {
    const continueBtn = document.querySelector('.button_continue');
    continueBtn.addEventListener('click', () => {
      MAIN.innerHTML = '';
      GamePage.render();
      Game.init();
    });
  }
}
