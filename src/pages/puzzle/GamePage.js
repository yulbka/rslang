import { MAIN } from '../../scripts/helpers/variables';
import { createElement } from '../../scripts/helpers/createElement';


export class GamePage {
  static render() {
    const container = createElement('div', MAIN, ['puzzle-container', 'container']);
    GamePage.renderControlPanel(container);
    createElement('div', container, ['result-container']);
    GamePage.renderResultBlock();
    GamePage.renderCheckBlock(container);
  }

  static renderControlPanel(element) {
    const fragment = document.createDocumentFragment();
    const controls = createElement('div', fragment, ['control']);
    const round = createElement('div', controls, ['round']);
    this.createDropListElement('level', round, 6);
    this.createDropListElement('page', round, 45);
    const promptButtons = createElement('div', controls, ['prompt-buttons']);
    ['voice', 'text', 'note', 'picture'].forEach((className) => {
      createElement('div', promptButtons, ['prompt-btn', `${className}`]);
    });
    const prompt = createElement('div', fragment, ['prompt']);
    const audio = createElement('div', prompt, ['prompt__button']);
    const img = createElement('img', audio, []);
    img.src = 'assets/images/puzzle/volume2.png';
    createElement('p', prompt, ['prompt__text', 'font-italic']);
    element.append(fragment);
  }

  static renderResultBlock() {
    const fragment = document.createDocumentFragment();
    const count = createElement('div', fragment, ['count']);
    createElement('div', count, ['count__number', 'count__number_active'], '1');
    const result = createElement('div', fragment, ['result']);
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((number) => {
      createElement('div', result, ['puzzle-row'], '', 'data-row', `${number}`);
    });
    const container =
    document.querySelector('.result-container', 'container');
    if (!container) return;
    container.append(fragment);
  }

  static renderCheckBlock(element) {
    const fragment = document.createDocumentFragment();
    createElement('div', fragment, ['data']);
    const checkContainer = createElement('div', fragment, ['check-container']);
    createElement('button', checkContainer,
        ['btn', 'btn-primary', 'puzzle-btn', 'puzzle-btn_help'], `Не знаю`);
    createElement('button', checkContainer, ['btn', 'btn-primary', 'puzzle-btn', 'puzzle-btn_check',
      'btn_hidden'], 'Проверить');
    createElement('button', checkContainer, ['btn', 'btn-primary', 'puzzle-btn', 'puzzle-btn_continue',
      'btn_hidden'], 'Продолжить');
    createElement('button', checkContainer, ['btn', 'btn-primary', 'puzzle-btn', 'puzzle-btn_results',
      'btn_hidden'], 'Результаты');
    element.append(fragment);
  }

  static refreshPageDropList(optionsNumber) {
    const pageDropList =
    document.querySelector('.page__droplist');
    if (!pageDropList) return;
    pageDropList.innerHTML = '';
    for (let i = 1; i <= optionsNumber; i ++) {
      createElement('option', pageDropList, [], `${i}`, 'value', `${i}`);
    }
  }

  static createDropListElement(name, node, optionsNumber) {
    const dropListContainer = createElement('div', node, [name]);
    name === 'level' ? createElement('span', dropListContainer, [`${name}__text`, 'text-dark'], 'уровень'):
    createElement('span', dropListContainer, [`${name}__text`], 'страница');
    const dropList = createElement('select', dropListContainer, ['custom-select', `${name}__droplist`]);
    for (let i = 1; i <= optionsNumber; i ++) {
      createElement('option', dropList, ['option'], `${i}`, 'value', `${i}`);
    }
    return dropList;
  }
}