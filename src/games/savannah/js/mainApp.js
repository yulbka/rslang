import { makeWord } from './htmlHelper';
import { randomize, arrayRandElement } from './utils';
import { getTranslations, getWords } from './apis';
import { constants } from '../../../js/constants';

export function createSavannahGame() {
  const startAnimation = () => {
    const movingWord = document.querySelector('.mainItem');
    movingWord.classList.add('moveToRight');
  };

  const pasteMainWord = (item) => {
    const wordsContainer = document.querySelector('.mainItem');
    const wordsFragment = document.createDocumentFragment();

    const word = makeWord(item);
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

  const startGame = () => {
    const { startScreen } = constants.DOM;
    startScreen.classList.add('hidden');
    startAnimation();
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

  const changeLvl = (event) => {
    if (!event.target.classList.contains('level__label')) {
      return;
    }

    localStorage.setItem('level', event.target.innerText);

    getInitialWords();
  };

  const selectWord = () => {
    const wordContainers = event.target.closest('.item');

    if (!wordContainers) {
      return;
    }

    const wordTranslation = document.querySelector('.item__translation');

    const englishWord = wordContainers.getAttribute('data-word');

    getTranslations(englishWord).then((data) => {
      wordTranslation.textContent = data.text;
      return undefined;
    });
  };

  const { word } = constants.DOM;
  word.addEventListener('mousedown', (e) => selectWord(e));

  const { level } = constants.DOM;
  level.addEventListener('mousedown', (e) => changeLvl(e));

  const { btnStart } = constants.DOM;
  btnStart.addEventListener('click', getInitialWords);
}
