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

  const lifesCheck = () => {
    const lifeBar = document.querySelector('.lifes');
    if (lifeBar.childNodes.length === 0) {
      gameOver();
    }
  };

  const startGame = () => {
    const { startScreen } = constants.DOM;
    startScreen.classList.add('hidden');
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
    const movingWord = document.querySelector('.mainItem');
    movingWord.classList.remove('invisible');
    startGame();
  };

  const rightScenario = () => {
    console.log('1');
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

    localStorage.setItem('level', event.target.innerText);

    getInitialWords();
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

    // correctContainer.innerHTML = '';
    // errorContainer.innerHTML = '';

    correctContainer.appendChild(correctFragment);
    errorContainer.appendChild(errorFragment);
  };

  const gameOver = () => {
    setTimeout(() => resultGame(), 2000);
  };

  const { word } = constants.DOM;
  word.addEventListener('mousedown', (e) => selectWord(e));

  const { level } = constants.DOM;
  level.addEventListener('mousedown', (e) => changeLvl(e));

  const { btnStart } = constants.DOM;
  btnStart.addEventListener('click', getInitialWords);
}
