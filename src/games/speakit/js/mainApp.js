import { makeWord, builtHtml } from './htmlHelper';
import { activeItem, listiner, randomize, audioPlayer, stopRecognition, stopTranslation } from './utils';
import speechRecognition from './speechRecognition';
import { getImages, getTranslations, getWords, startImage } from './apis';
import { constants } from '../../../js/constants';
// import {renderSpeakIt} from './render'

// renderSpeakIt();

export function createSpeakItGame() {
  const pasteWords = (items) => {
    console.log('1');
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
    startImage();
    getWords(randomize(30), 0).then((data) => pasteWords(data.slice(0, 10)));
  };

  const changeLvl = (event) => {
    if (!event.target.classList.contains('level__label')) {
      return;
    }

    localStorage.setItem('level', event.target.innerText);
    const currLvl = localStorage.getItem('level') || 0;

    stopTranslation();
    stopRecognition();
    startImage();

    getWords(randomize(30), currLvl).then((data) => pasteWords(data.slice(0, 10)));
  };

  const selectWord = (event) => {
    const wordContainers = event.target.closest('.item');

    if (!wordContainers) {
      return;
    }

    const words = document.querySelector('.items').children;
    activeItem(wordContainers, words);

    const wordImage = document.querySelector('.word__img');
    const wordTranslation = document.querySelector('.word__translation');

    const englishWord = wordContainers.getAttribute('data-word');
    const audio = wordContainers.getAttribute('data-audio-src');
    const image = wordContainers.getAttribute('data-image-src');

    audioPlayer(`https://raw.githubusercontent.com/bobrysh/data/master/data/${audio}`);
    getImages(image).then((url) => {
      wordImage.src = url;
      return undefined;
    });
    stopRecognition();
    getTranslations(englishWord).then((data) => {
      wordTranslation.textContent = data.text;
      return undefined;
    });
  };

  const restartGame = (event) => {
    document.querySelectorAll('.item').forEach((item) => {
      item.classList.remove('item--right');
    });

    event.target.classList.add('restart--active');
    listiner(false);
    startImage();
    stopTranslation();
  };

  const manageResultTable = (event) => {
    const item = event.target.closest('.item');
    if (item) {
      const audioSrc = item.getAttribute('data-audio-src');
      audioPlayer(`https://raw.githubusercontent.com/bobrysh/data/master/data/${audioSrc}`);
    } else if (event.target.classList.contains('btn__return')) {
      event.preventDefault();
      document.querySelector('.results').classList.add('hidden');
    } else if (event.target.classList.contains('btn__new-game')) {
      event.preventDefault();
      stopTranslation();
      stopRecognition();
      startImage();
      getWords(randomize(30), 0).then((data) => pasteWords(data.slice(0, 10)));
      document.querySelector('.results').classList.add('hidden');
    }
  };

  const resultGame = () => {
    const wordsClone = document.querySelector('.items').cloneNode(true);
    const words = wordsClone.children;
    const errorContainer = document.querySelector('.wrong__items');
    const correctContainer = document.querySelector('.right__items');

    const errorCount = document.querySelector('.wrong__count');
    const correctCount = document.querySelector('.right__count');

    const correctFragment = document.createDocumentFragment();
    const errorFragment = document.createDocumentFragment();

    Array.from(words).forEach((word) => {
      const translation = builtHtml({
        tagName: 'p',
        classList: ['item__translation'],
      });
      const engWord = word.getAttribute('data-word');
      getTranslations(engWord).then((res) => {
        translation.textContent = res.text;
        return undefined;
      });
      word.appendChild(translation);

      if (word.classList.contains('item--right')) {
        correctFragment.appendChild(word);
      } else {
        errorFragment.appendChild(word);
      }
    });

    correctCount.innerText = correctFragment.children.length || 0;
    errorCount.innerText = errorFragment.children.length || 0;

    correctContainer.innerHTML = '';
    errorContainer.innerHTML = '';

    correctContainer.appendChild(correctFragment);
    errorContainer.appendChild(errorFragment);
  };

  const manageGame = (event) => {
    if (event.target.classList.contains('btn__speak')) {
      speechRecognition();
      listiner(true);
    } else if (event.target.classList.contains('btn__restart')) {
      restartGame(event);
    } else if (event.target.classList.contains('btn__results')) {
      document.querySelector('.results').classList.remove('hidden');
      resultGame();
    }
  };

  const { word } = constants.DOM;
  word.addEventListener('mousedown', (e) => selectWord(e));

  const { level } = constants.DOM;
  level.addEventListener('mousedown', (e) => changeLvl(e));

  const { btns } = constants.DOM;
  btns.addEventListener('click', (e) => manageGame(e));

  const { btnStart } = constants.DOM;
  btnStart.addEventListener('click', startGame);

  const { resultsTable } = constants.DOM;
  resultsTable.addEventListener('click', (e) => manageResultTable(e));
}
