import { makeWord, makeMainWord } from './htmlHelper';
import { randomize, arrayRandElement } from './utils';
import { getWords } from './apis';
import { constants } from '../../../js/constants';

export function createSavannahGame() {
  let rightAnswers = 0;
  const makeHearts = () => {
    const lifes = 5;
    const lifeBar = document.querySelector('.lifes');
    for (let i = 0; i < lifes; i++) {
      const life = document.createElement('i');
      life.classList.add('pulsingheart');
      lifeBar.append(life);
    }
  };
  makeHearts();

  const startAnimation = () => {
    const movingWord = document.querySelector('.mainItem');
    movingWord.classList.remove('invisible');
    movingWord.classList.add('moveToRight');
  };

  const pasteMainWord = (item) => {
    const wordsContainer = document.querySelector('.mainItem');
    const wordsFragment = document.createDocumentFragment();

    const word = makeMainWord(item);
    wordsFragment.appendChild(word);

    wordsContainer.innerHTML = '';
    wordsContainer.appendChild(wordsFragment);
  };

  const pasteWords = (items) => {
    const wordsContainer = document.querySelector('.items');
    const wordsFragment = document.createDocumentFragment();

    items.forEach((item) => {
      const word = makeWord(item);
      wordsFragment.appendChild(word);
    });

    wordsContainer.innerHTML = '';
    wordsContainer.appendChild(wordsFragment);
  };

  const progressCheck = () => {
    const progress = document.querySelector('.progressBar');
    const image = document.querySelector('.fit-picture');

    progress.textContent = `${rightAnswers}/10`;
    switch (rightAnswers) {
      case 1:
        image.style.width = '80px';
        break;
      case 2:
        image.style.width = '85px';
        break;
      case 3:
        image.style.width = '90px';
        break;
      case 4:
        image.style.width = '95px';
        break;
      case 5:
        image.style.width = '100px';
        break;
      case 6:
        image.style.width = '105px';
        break;
      case 7:
        image.style.width = '110px';
        break;
      case 8:
        image.style.width = '115px';
        break;
      case 9:
        image.style.width = '120px';
        break;
      case 10:
        image.style.width = '125px';
        break;
      default:
        image.style.width = '75px';
        break;
    }
  };

  const lifesCheck = () => {
    const lifeBar = document.querySelector('.lifes');
    if (lifeBar.childNodes.length === 0) {
      gameOver();
    }
  };

  const startGame = () => {
    const { startScreen } = constants.DOM;
    startScreen.classList.add('hidden');
    progressCheck();
    lifesCheck();

    setTimeout(() => startAnimation(), 2500);
  };

  const currLvl = localStorage.getItem('level') || 0;

  const getInitialWords = () => {
    getWords(randomize(30), currLvl).then((data) => {
      const savedWords = data.slice(0, 4);
      pasteWords(savedWords);
      const mainWord = arrayRandElement(savedWords);
      pasteMainWord(mainWord);
    });

    startGame();
  };

  const rightScenario = () => {
    resultGame();
    const movingWord = document.querySelector('.mainItem');
    movingWord.classList.add('invisible');
    movingWord.classList.remove('moveToRight');
    rightAnswers++;
    if (rightAnswers === 10) {
      gameOver();
    } else {
      setTimeout(() => getInitialWords(), 2000);
    }
  };

  const wrongScenario = () => {
    resultGame();
    const movingWord = document.querySelector('.mainItem');
    const wrongWords = document.querySelector('.item--wrong');
    const lifeBar = document.querySelector('.lifes');
    movingWord.classList.add('invisible');
    movingWord.classList.remove('moveToRight');
    wrongWords.classList.remove('item--wrong');
    lifeBar.removeChild(lifeBar.lastElementChild);
    setTimeout(() => getInitialWords(), 3000);
  };

  const changeLvl = (event) => {
    if (!event.target.classList.contains('level__label')) {
      return;
    }
    const movingWord = document.querySelector('.mainItem');
    movingWord.classList.remove('moveToRight');
    localStorage.setItem('level', event.target.innerText);
    const hearts = document.querySelectorAll('.pulsingheart');
    hearts.forEach((item) => {
      item.remove();
    });
    rightAnswers = 0;
    makeHearts();
    getInitialWords();
    startGame();
  };

  const selectWord = () => {
    const wordContainers = event.target.closest('.item');
    const wordMainContainers = document.querySelector(
      '#main > div > main > div.savannah > section.word > div.word__items.mainItem.moveToRight > div'
    );

    if (!wordContainers) {
      return;
    }

    const englishMainWord = wordMainContainers.getAttribute('data-word');
    const englishWord = wordContainers.getAttribute('data-word');

    if (englishWord === englishMainWord) {
      wordContainers.classList.add('item--right', 'selected');
      setTimeout(rightScenario(), 1000);
    } else {
      wordContainers.classList.add('item--wrong', 'selected');
      setTimeout(() => wrongScenario(), 1000);
    }
  };

  const resultGame = () => {
    const wordsClone = document.querySelector('.selected').cloneNode(true);
    const errorContainer = document.querySelector('.wrong__items');
    const correctContainer = document.querySelector('.right__items');

    const correctFragment = document.createDocumentFragment();
    const errorFragment = document.createDocumentFragment();

    if (wordsClone.classList.contains('item--right')) {
      correctFragment.appendChild(wordsClone);
    } else {
      errorFragment.appendChild(wordsClone);
    }

    correctContainer.appendChild(correctFragment);
    errorContainer.appendChild(errorFragment);
  };

  const gameOver = () => {
    document.querySelector('.results').classList.remove('hidden');
  };

  const manageGame = (event) => {
    if (event.target.classList.contains('button__new-game')) {
      document.querySelector('.results').classList.add('hidden');
      const hearts = document.querySelectorAll('.pulsingheart');
      hearts.forEach((item) => {
        item.remove();
      });
      rightAnswers = 0;
      makeHearts();
      getInitialWords();
      startGame();
    }
  };

  const { btns } = constants.DOM;
  btns.addEventListener('click', (e) => manageGame(e));

  const { word } = constants.DOM;
  word.addEventListener('mousedown', (e) => selectWord(e));

  const { level } = constants.DOM;
  level.addEventListener('mousedown', (e) => changeLvl(e));

  const { btnStart } = constants.DOM;
  btnStart.addEventListener('click', getInitialWords);
}
