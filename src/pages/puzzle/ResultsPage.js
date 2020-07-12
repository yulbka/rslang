import { book } from './Sentence';
import { GamePage } from './GamePage';
import { Game } from './Game';
import { paintings } from './Puzzle';
import { createElement } from '../../scripts/helpers/createElement';
import { MAIN } from '../../scripts/helpers/variables';

export class ResultsPage {
  constructor(level, page) {
    this.level = level;
    this.page = page;
  }

  init() {
    this.render();
    this.continue();
    this.statistic();
  }

  render() {
    const pictureData = paintings[this.level][this.page - 1];
    const fragment = document.createDocumentFragment();
    const container = createElement('div', fragment, ['container']);
    const pictureBlock = createElement('div', container, ['picture-container']);
    const picture = createElement('a', pictureBlock,
        ['picture-container__picture'], undefined, 'href',
        `https://raw.githubusercontent.com/yulbka/rslang_data_paintings/master/${pictureData.imageSrc}`);
    picture.style.backgroundImage =
    `url(https://raw.githubusercontent.com/yulbka/rslang_data_paintings/master/${pictureData.cutSrc})`;
    createElement('p', pictureBlock, ['picture__title', 'text-dark'],
        `${pictureData.author} - ${pictureData.name} (${pictureData.year})`);
    const notKnow = createElement('div', container, ['know']);
    const notKnowTitle =
    createElement('p', notKnow, ['know__title'], `I don't know: `);
    const know = createElement('div', container, ['know']);
    const knowTitle = createElement('p', know, ['know__title'], 'I know: ');
    const words = book[this.level].slice((this.page - 1) * 10,
        (this.page - 1) * 10 + 10);
    let countWrongs = 0;
    let countRights = 0;
    words.forEach((word) => {
      let sentence;
      if (localStorage.getItem(word.id) === 'wrong') {
        sentence =
        createElement('p', notKnow, ['results__sentence', 'text-dark']);
        countWrongs += 1;
      } else {
        sentence =
        createElement('p', know, ['results__sentence', 'text-dark']);
        countRights += 1;
      }
      const ico = createElement('span', sentence, ['results__ico']);
      sentence.prepend(ico);
      createElement('p', sentence, ['sentence__example'], word.textExample);
      createElement('p', sentence, ['sentence__translate', 'font-italic'],
          word.textTranslate);
      const audio = new Audio(`https://raw.githubusercontent.com/yulbka/rslang-data/master/${word.audio}`);
      sentence.addEventListener('click', () => {
        audio.play();
      });
    });
    createElement('span', notKnowTitle, ['results__count', 'text-danger'], ` ${countWrongs}`);
    createElement('span', knowTitle, ['results__count', 'text-success'], ` ${countRights}`);
    const buttons = createElement('div', fragment, ['results__buttons']);
    createElement('button', buttons, ['button', 'results__button_continue'],
        'Continue');
    createElement('button', buttons, ['button', 'results__button_statistic'],
        'Statistic');
    MAIN.append(fragment);
  }

  static continue() {
    const continueBtn =
    document.querySelector('.results__button_continue');
    continueBtn.addEventListener('click', () => {
      MAIN.innerHTML = '';
      GamePage.render();
      Game.init();
    });
  }

  // statistic() {
  //   const statisticBtn =
  //   document.querySelector('.results__button_statistic');
  //   statisticBtn.addEventListener('click', () => {
  //     RESULTS_PAGE.innerHTML = '';
  //     new Statistic().init();
  //   });
  // }
}