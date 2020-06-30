import { requestCreator } from '../utils/requests';
import { MAIN } from './helpers/variables';
import { createElement } from './helpers/createElement';
import { store } from '../store/index';
import { findLongestSeries } from './helpers/findLongestSeries';

export class Statistics {
  static async get() {
    const statistics = await requestCreator({
      url: `/users/${localStorage.getItem('userId')}/statistics`,
      method: requestCreator.methods.get
    });
    console.log(statistics);
    return statistics;
  }

  static async set(statData) {
    const statistics = await requestCreator({
      url: `/users/${localStorage.getItem('userId')}/statistics`,
      method: requestCreator.methods.put,
      data: statData
    });
    console.log(statistics);
    return statistics;
  }
  
  static renderShortPage() {
    const { cards, newWords } = store.mainGame.statistics.short;
    const answers = store.mainGame.statistics.short.answers.split('');
    const rightAnswers = answers.filter((answer) => answer === 'T').length;
    const series = findLongestSeries(answers, 'T');
    MAIN.innerHTML = '';
    const fragment = document.createDocumentFragment();
    const wrapper = createElement('div', fragment, ['short-statistics__wrapper']);
    const header = createElement('div', wrapper, ['short-statistics__header']);
    createElement('div', header, ['completed']);
    createElement('h2', header, ['short-statistics__title', 'text-info'], 'Серия завершена');
    const ul = createElement('ul', wrapper, ['short-statistics__data']);
    const cardsData = createElement('li', ul, ['data__text', 'text-primary']);
    createElement('span', cardsData, [], 'Карточек завершено:');
    createElement('span', cardsData, [], `${cards}`);
    const answersData = createElement('li', ul, ['data__text', 'text-success']);
    createElement('span', answersData, [], 'Правильные ответы:');
    createElement('span', answersData, [], `${Math.round(rightAnswers / answers.length * 100)}%`);
    const newWordsData = createElement('li', ul, ['data__text', 'text-warning']);
    createElement('span', newWordsData, [], 'Новые слова:');
    createElement('span', newWordsData, [], `${newWords}`);
    const seriesData = createElement('li', ul, ['data__text', 'text-info']);
    createElement('span', seriesData, [], 'Самая длинная серия правильных ответов:');
    createElement('span', seriesData, [], `${series}`);
    createElement('button', wrapper, ['btn', 'btn-primary', 'btn-lg', 'short-statistics__btn'], 'Продолжить');
    MAIN.append(fragment);
  }
}

