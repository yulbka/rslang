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

  static renderLongPage() {
    const fragment = document.createDocumentFragment();
    const { learnedWords } = store.mainGame.statistics;
    const wrapper = createElement('div', fragment, ['long-statistics__wrapper']);
    const header = createElement('div', wrapper, ['long-statistics__header']);
    createElement('span', header, ['long-statistics__title', 'text-info'], 'Всего слов: ');
    createElement('span', header, ['long-statistics__title', 'text-info'], `${learnedWords}`);
    const graph = createElement('div', wrapper, ['graph']);
    const range = createElement('input', wrapper, ['custom-range'], '', 'type', 'range');
    range.min = 0;
    range.max = 5000;
    MAIN.append(fragment);
    this.buildGraph(graph, learnedWords);
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
    const coords = [
      { x: 18, y: 1 },
      { x: 25, y: 7 },
      { x: 46, y: 12 },
      { x: 49, y: 12 },
      { x: 55, y: 14 },
      { x: 74, y: 19 },
      { x: 98, y: 20 },
      { x: 110, y: 21 },
      { x: 123, y: 22 },
      { x: 138, y: 23 },
      { x: 147, y: 24 },
      { x: 165, y: 27 },
      { x: 172, y: 29 },
      { x: 184, y: 31 },
      { x: 202, y: 31 },
      { x: 221, y: 32 },
      { x: 230, y: 33 },
      { x: 245, y: 34 },
      { x: 270, y: 36 },
      { x: 294, y: 36 },
      { x: 319, y: 37 },
      { x: 331, y: 38 },
      { x: 368, y: 39 },
      { x: 377, y: 40 },
      { x: 392, y: 41 },
      { x: 417, y: 44 },
      { x: 441, y: 46 },
      { x: 469, y: 46 },
      { x: 478, y: 48 },
      { x: 496, y: 48 },
      { x: 506, y: 49 },
      { x: 515, y: 49 },
      { x: 539, y: 50 },
      { x: 551, y: 51 },
      { x: 564, y: 51 },
      { x: 570, y: 54 },
      { x: 588, y: 55 },
      { x: 616, y: 55 },
      { x: 625, y: 57 },
      { x: 653, y: 57 },
      { x: 662, y: 58 },
      { x: 671, y: 58 },
      { x: 686, y: 59 },
      { x: 711, y: 59 },
      { x: 735, y: 60 },
      { x: 744, y: 61 },
      { x: 760, y: 61 },
      { x: 781, y: 62 },
      { x: 800, y: 62 },
      { x: 827, y: 63 },
      { x: 836, y: 64 },
      { x: 864, y: 64 },
      { x: 873, y: 65 },
      { x: 882, y: 65 },
      { x: 901, y: 66 },
      { x: 956, y: 66 },
      { x: 974, y: 67 },
      { x: 980, y: 67 },
      { x: 1005, y: 69 },
      { x: 1176, y: 69 },
      { x: 1201, y: 70 },
      { x: 1299, y: 70 },
      { x: 1324, y: 71 },
      { x: 1397, y: 71 },
      { x: 1406, y: 73 },
      { x: 1489, y: 73 },
      { x: 1520, y: 74 },
      { x: 1593, y: 74 },
      { x: 1618, y: 76 },
      { x: 1740, y: 77 },
      { x: 1814, y: 78 },
      { x: 1936, y: 79 },
      { x: 2010, y: 80 },
      { x: 2132, y: 81 },
      { x: 2377, y: 82 },
      { x: 2500, y: 83 },
      { x: 2868, y: 84 },
      { x: 2955, y: 84 },
      { x: 3137, y: 87 },
      { x: 3333, y: 88 },
      { x: 3578, y: 89 },
      { x: 3995, y: 90 },
      { x: 4436, y: 91 },
      { x: 4926, y: 92 },
      { x: 5000, y: 92 },
    ];
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

  static fillGraph() {

  }
}

