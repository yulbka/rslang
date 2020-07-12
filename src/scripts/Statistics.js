import { requestCreator } from '../utils/requests';
import { MAIN, coords, routesMap, routeKeys } from './helpers/variables';
import { createElement } from './helpers/createElement';
import { store } from '../store/index';
import { findLongestSeries } from './helpers/findLongestSeries';
import { router } from '../routes';

export class Statistics {
  static async get() {
    try {
      const statistics = await requestCreator({
        url: `/users/${localStorage.getItem('userId')}/statistics`,
        method: requestCreator.methods.get
      });
      return statistics;
    }
    catch(e) {
      console.log(e);
    }
  }

  static async set(statData) {
    const statistics = await requestCreator({
      url: `/users/${localStorage.getItem('userId')}/statistics`,
      method: requestCreator.methods.put,
      data: statData
    });
    return statistics;
  } 
  
  static renderShortPage() {
    const { cards, newWords } = store.statistics.mainGame.short;
    const answers = store.statistics.mainGame.short.answers.split('');
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
    this.continueHandler();
  }

  static continueHandler() {
    const continueBtn = document.querySelector('.short-statistics__btn');
    continueBtn.addEventListener('click', async () => {
      const today = new Date().toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' });
      store.statistics.mainGame.short = {
        day: today,
        cards: 0,
        newWords: 0,
        answers: ''
      };
      await Statistics.set({
      learnedWords: store.statistics.learnedWords,
      optional: {
        mainGame: store.statistics.mainGame,
        ...store.statistics,
      }
      });
      router.navigate(routesMap.get(routeKeys.home).url);
    });
  }

  static async renderLongPage() {
    const statistics = await this.get();
    store.statistics.mainGame = statistics.optional.mainGame;
    const fragment = document.createDocumentFragment();
    const { learnedWords } = statistics;
    const wrapper = createElement('div', fragment, ['long-statistics__wrapper']);
    const header = createElement('div', wrapper, ['long-statistics__header']);
    const info = createElement('p', header, ['long-statistics__title']);
    createElement('span', info, ['text-info'], 'Всего слов: ');
    createElement('span', info, ['text-info'], `${learnedWords}`);
    const detail = createElement('a', header, ['long-statistics__detail'], '', 'data-toggle', 'modal');
    detail.setAttribute('data-target', '#exampleModalLong');
    this.renderModal(wrapper);
    createElement('span', detail, ['detail-ico']);
    createElement('span', detail, ['detail-text', 'text-info'], 'Подробнее');
    const graph = createElement('div', wrapper, ['graph']);
    const graphText = createElement('p', graph, ['graph-text']);
    createElement('span', graphText, [], 'Слов: ');
    createElement('span', graphText, ['graph-words'], `${learnedWords}`);
    const range = createElement('input', wrapper, ['custom-range', 'graph__range'], '', 'type', 'range');
    const rangeText = createElement('p', wrapper, ['range-text', 'text-info']);
    const percent = coords.find((coord) => coord.x >= learnedWords).y;
    createElement('span', rangeText, ['range-percent'], `${percent}`);
    createElement('span', rangeText, [], '% слов любого текста');
    range.min = 0;
    range.max = 5000;
    range.value = learnedWords;
    MAIN.append(fragment);
    this.buildGraph(graph, learnedWords);
    this.rangeHandler();
    this.resizeHandler();
  }

  static buildGraph(element, wordsCount) {
    const canvas = createElement('canvas', element, []);
    const ctx = canvas.getContext('2d');
    canvas.width = element.clientWidth;
    canvas.height = element.clientWidth;
    const margin = 40;
    this.drawGraphLine(ctx, canvas.width, canvas.height, margin, 'rgb(230, 249, 252)', 5000);
    this.drawGraphLine(ctx, canvas.width, canvas.height, margin, 'rgb(23, 162, 184)', wordsCount);
    this.drawGraphAxis(ctx, canvas.width, canvas.height, margin);
  }

  static drawGraphAxis(ctx, width, height, margin) {
    const stepCount = 10;
    const stepWidth = (width - 2 * margin) / 5;
    const stepHeight = (height - 2 * margin) / stepCount;
    ctx.strokeStyle = 'rgb(200, 200, 200)';
    ctx.fillStyle = 'rgb(200, 200, 200)';
    for(let i = 0; i < 11; i++) {
      const positionY = height - margin - i * stepHeight;
      ctx.fillText(`${i * 10}%`, 10, positionY); 
      ctx.beginPath();
      ctx.moveTo(margin, positionY); 
      ctx.lineTo(width - margin, positionY); 
      ctx.stroke(); 
    }
    [1000, 2000, 3000, 4000, 5000].forEach((label, index) => {
      const positionX = margin + (index + 1) * stepWidth;
      ctx.fillText(label, positionX - stepWidth / 2, height - 10);
      ctx.beginPath();
      ctx.moveTo(positionX, height - margin);
      ctx.lineTo(positionX, margin);
      ctx.stroke();
    });
  }

  static drawGraphLine(ctx, width, height, margin, colorFill, maxX) {
    const xScale = (width - 2 * margin) / 5000;
    const yScale = (height - 2 * margin) / 100;  
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(23, 162, 184)';
    ctx.moveTo(margin, height - margin);
    let isMax = false;
    coords.forEach((coord, index) => {
      if (coord.x > maxX) {
        if (isMax) return;
        ctx.lineTo(margin + maxX * xScale, height - margin - coords[index - 1].y * yScale);
        isMax = true;
        
        return;
      }
      ctx.lineTo(margin + coord.x * xScale, height - margin - coord.y * yScale);
    });
    ctx.lineTo(margin + maxX * xScale, height - margin);
    ctx.fillStyle = colorFill;
    ctx.fill();
    ctx.stroke();
  }

  static rebuiltGraph = () => {
    const graph = document.querySelector('.graph');
    if (!graph) return;
    const range = document.querySelector('.graph__range');
    const rangePercent = document.querySelector('.range-percent');
    graph.innerHTML = '';
    this.buildGraph(graph, range.value);
    const percent = coords.find((coord) => coord.x >= range.value).y;
    rangePercent.textContent = percent;
    const graphText = createElement('p', graph, ['graph-text']);
    createElement('span', graphText, [], 'Слов: ');
    createElement('span', graphText, ['graph-words'], `${range.value}`);
  }

  static rangeHandler() {
    const range = document.querySelector('.graph__range');
    range.addEventListener('change', this.rebuiltGraph);
  }

  static resizeHandler() {
    window.addEventListener('resize', this.rebuiltGraph);
  }
  
  static renderModal(element) {
    const fragment = document.createDocumentFragment();
    const modal = createElement('div', fragment, ['modal', 'fade'], '', 'role', 'dialog');
    modal.id = 'exampleModalLong';
    const dialog = createElement('div', modal, ['modal-dialog'], '', 'role', 'dialog');
    const content = createElement('div', dialog, ['modal-content']);
    const body = createElement('div', content, ['modal-body']);
    const statistics = store.statistics.mainGame.long;
    for (const [date, value] of Object.entries(statistics)) {
      const p = createElement('p', body, []);
      createElement('span', p, ['text-info'], `${date}: `);
      createElement('span', p, [], 'просмотрено карточек: ');
      createElement('span', p, ['text-primary'], `${value.cards}, `);
      createElement('span', p, [], 'изучено новых слов: ');
      createElement('span', p, ['text-success'], `${value.newWords}, `);
      createElement('span', p, [], 'допущено ошибок: ');
      createElement('span', p, ['text-danger'], `${value.mistakes}`);
    }
    const footer = createElement('div', content, ['modal-footer']);
    createElement('button', footer, ['btn', 'btn-secondary'], 'Закрыть', 'data-dismiss', 'modal');
    element.append(fragment);
  }  
}
