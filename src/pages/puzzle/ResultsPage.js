import { GamePage } from './GamePage';
import { Game } from './Game';
import { paintings } from './Puzzle';
import { createElement } from '../../scripts/helpers/createElement';
import { MAIN } from '../../scripts/helpers/variables';
import { Statistics } from '../../scripts/Statistics';
import { API_USER } from '../../api/user';
import { StatisticsPage } from './StatisticsPage';

export class ResultsPage {
  constructor(level, page) {
    this.level = level;
    this.page = page;
  }

  async init() {
    await this.render();
    this.continue();
    this.statistic();
  }

  async render() {
    const results = await Statistics.get();
    const settings = await API_USER.getUserSettings({ userId: localStorage.getItem('userId') });
    const pictureData = settings.englishPuzzle.useLearnedWords
      ? paintings[this.level + 1][this.page]
      : paintings[this.level][this.page - 1];
    const fragment = document.createDocumentFragment();
    const container = createElement('div', fragment, ['container']);
    const pictureBlock = createElement('div', container, ['picture-container']);
    const picture = createElement(
      'a',
      pictureBlock,
      ['picture-container__picture'],
      undefined,
      'href',
      `https://raw.githubusercontent.com/yulbka/rslang_data_paintings/master/${pictureData.imageSrc}`
    );
    picture.target = '_blank';
    picture.style.backgroundImage = `url(https://raw.githubusercontent.com/yulbka/rslang_data_paintings/master/${pictureData.cutSrc})`;
    createElement(
      'p',
      pictureBlock,
      ['picture__title', 'text-dark'],
      `${pictureData.author} - ${pictureData.name} (${pictureData.year})`
    );
    const notKnow = createElement('div', container, ['know']);
    const notKnowTitle = createElement('p', notKnow, ['know__title'], `Я не знаю: `);
    const know = createElement('div', container, ['know']);
    const knowTitle = createElement('p', know, ['know__title'], 'Я знаю: ');
    let countWrongs = 0;
    let countRights = 0;
    for (const value of Object.values(results.optional.englishPuzzle.short)) {
      let sentence;
      if (value.mistake === 'wrong') {
        sentence = createElement('p', notKnow, ['results__sentence', 'text-dark']);
        countWrongs += 1;
      } else {
        sentence = createElement('p', know, ['results__sentence', 'text-dark']);
        countRights += 1;
      }
      const ico = createElement('span', sentence, ['results__ico']);
      sentence.prepend(ico);
      createElement('p', sentence, ['sentence__example'], value.sentence);
      createElement('p', sentence, ['sentence__translate', 'font-italic'], value.translate);
      const audio = new Audio(`https://raw.githubusercontent.com/yulbka/rslang-data/master/${value.audio}`);
      sentence.addEventListener('click', () => {
        audio.play();
      });
    }
    createElement('span', notKnowTitle, ['results__count', 'text-danger'], ` ${countWrongs}`);
    createElement('span', knowTitle, ['results__count', 'text-success'], ` ${countRights}`);
    const buttons = createElement('div', fragment, ['results__buttons']);
    createElement('button', buttons, ['btn', 'btn-primary', 'puzzle-btn', 'results__button_continue'], 'Продолжить');
    createElement('button', buttons, ['btn', 'btn-primary', 'puzzle-btn', 'results__button_statistic'], 'Статистика');
    MAIN.append(fragment);
  }

  continue() {
    const continueBtn = document.querySelector('.results__button_continue');
    continueBtn.addEventListener('click', async () => {
      Game.resetShortStatistics();
      MAIN.innerHTML = '';
      GamePage.render();
      Game.init();
    });
    return this;
  }

  statistic() {
    const statisticBtn = document.querySelector('.results__button_statistic');
    statisticBtn.addEventListener('click', () => {
      MAIN.innerHTML = '';
      StatisticsPage.init();
    });
    return this;
  }
}
