import { constants } from 'js/constants';
import { requestCreator } from 'utils/requests';
import { store } from 'store/index';
import { WordService } from 'scripts/service/Word.Service';
import { routesMap, routeKeys } from 'scripts/helpers/variables';

export const audiocallGameSettings = {
  currentGame: {
    currentWord: 0,
    setCurrentWord() {
      const isEndGame = this.statistics.learned.size + this.statistics.errors.size === this.maxWordsLength;
      if (isEndGame) {
        createGameStatistics();
        return;
      }

      let newWordIndex;
      let newWord;

      do {
        newWordIndex = getRandomInt(audiocallGameSettings.wordsArray.length);
        newWord = audiocallGameSettings.wordsArray[newWordIndex].word;
      } while (this.statistics.learned.has(newWord) || this.statistics.errors.has(newWord));

      this.currentWord = newWordIndex;
    },
    maxWordsLength: 10,
    variants: 5,
    statistics: {
      learned: new Map(),
      errors: new Map(),
    },
  },
  get currentLevel() {
    return localStorage.getItem('levelAudiocallGame') ? +localStorage.getItem('levelAudiocallGame') : 1;
  },
  wordsMap: new Map(),
  get wordsArray() {
    return Array.from(this.wordsMap.values());
  },
  async getWords() {
    const words = await WordService.getWordsByLevelAndPage(this.currentLevel, 0);
    words.forEach((gameWord) =>
      this.wordsMap.set(gameWord.word, {
        word: gameWord.word,
        audio: gameWord.audio,
        image: gameWord.image,
        wordTranslate: gameWord.wordTranslate,
        level: gameWord.group,
      })
    );
  },
};

export async function audioCallGameCreate() {
  const { main } = constants.DOM;
  const { body } = constants.DOM;
  body.classList.remove('main-page');
  body.classList.add('audiocall-game', 'start-screen');
  main.insertAdjacentHTML(
    'afterbegin',
    `
        <section class="audiocall-game-section container"></section>
        `
  );

  backgroundColorsHandler();
  createStartScreen();
  await audiocallGameSettings.getWords();
}

function createStartScreen() {
  createButtonStart();
}

async function timer() {
  const { audioCallGameSection } = constants.DOM;
  audioCallGameSection.innerHTML = '';
  audioCallGameSection.insertAdjacentHTML(
    'afterbegin',
    `
        <div class="timer">3</div>
  `
  );
  const timerBlock = audioCallGameSection.querySelector('.timer');

  function timerStepsCreate() {
    return new Promise((resolve) => {
      let step = 2;
      const id = setInterval(() => {
        timerBlock.innerHTML = step || 'Старт';
        step--;
        if (step < 0) {
          clearInterval(id);
          resolve();
        }
      }, 1000);
    });
  }

  await timerStepsCreate();
  setTimeout(playAudiocallGame, 1000);
}

function createButtonStart() {
  const { audioCallGameSection } = constants.DOM;
  audioCallGameSection.insertAdjacentHTML(
    'afterbegin',
    `
  <button class='begin-audiocall btn btn-outline-light'>Начать игру</button>`
  );
  const playButton = audioCallGameSection.querySelector('.begin-audiocall');
  playButton.addEventListener('click', timer);
}

function playAudiocallGame() {
  const { currentGame } = audiocallGameSettings;
  const allWords = audiocallGameSettings.wordsArray;
  currentGame.setCurrentWord();
  const { body } = constants.DOM;
  body.classList.remove('start-screen');
  body.classList.add('play-mode');
  const { audioCallGameSection } = constants.DOM;
  audioCallGameSection.innerHTML = '';

  audioCallGameSection.insertAdjacentHTML(
    'afterbegin',
    `
        ${createLevelsBlock()}
        <div class="audiocall-game-top">
            ${renderContent()}
        </div>   
        <div class="audiocall-game-bottom">
            <button type="button" class="btn btn-outline-light audiocall-button button-not-know">Не знаю</button>
        </div>
        `
  );
  audioButtonHandler();
  playAudio();

  function renderContent() {
    const guessWord = audiocallGameSettings.wordsArray[currentGame.currentWord];
    const answers = (() => {
      const answersMap = { [guessWord.word]: guessWord };
      let needAnswers = currentGame.variants - 1;
      while (needAnswers > 0) {
        const randomIndex = getRandomInt(allWords.length);
        const randomWord = allWords[randomIndex];
        if (!(randomWord.word in answersMap)) {
          answersMap[randomWord.word] = randomWord;
          needAnswers--;
        }
      }

      return randomSort({ arr: Object.values(answersMap) });

      function randomSort({ arr }) {
        const result = [];
        const resultMap = {};
        do {
          const currentItem = arr[getRandomInt(arr.length)];
          if (!(currentItem.word in resultMap)) {
            resultMap[currentItem.word] = true;
            result.push(currentItem);
          }
        } while (result.length !== arr.length);
        return result;
      }
    })();

    return `
            <div class="card-preview inactive">
              <img class="card-img" src='https://raw.githubusercontent.com/MariannaV/rslang-data/master/${
                guessWord.image
              }' />
              <div class="word-description">
                <img class="sound-img" src=${require('assets/img/icons/sound.svg').default} />
                <p class="hidden-word">${guessWord.word}</p>
             </div>
           </div>
           <div class="block-with-words">
            ${answers
              .map(
                ({ word, wordTranslate }, index) =>
                  `<p class="answer-word" data-id=${word}><span>${index + 1}</span>${wordTranslate}</p>`
              )
              .join('')}
           </div>
          `;
  }

  function updateContent() {
    const content = audioCallGameSection.querySelector('.audiocall-game-top');
    content.innerHTML = '';
    content.insertAdjacentHTML('afterbegin', renderContent());
    playAudio();
    audioButtonHandler();
    answersHandler();
  }

  async function playAudio() {
    const guessWord = allWords[currentGame.currentWord];
    const audioWord = new Audio(`https://raw.githubusercontent.com/MariannaV/rslang-data/master/${guessWord.audio}`);
    await audioWord.play();
  }

  levelsBlockHandler();
  gameButtonHandler();
  answersHandler();

  function audioButtonHandler() {
    document.querySelector('.sound-img').addEventListener('click', playAudio);
  }

  function gameButtonHandler() {
    const { errors } = currentGame.statistics;
    const notKnowButton = audioCallGameSection.querySelector('.audiocall-button');
    notKnowButton.addEventListener('click', () => {
      const isNotKnow = notKnowButton.classList.contains('button-not-know');
      const isNext = notKnowButton.classList.contains('button-next');
      if (isNotKnow) {
        const correctAnswer = document.querySelector(`.answer-word[data-id=${allWords[currentGame.currentWord].word}]`);
        correctAnswer.classList.add('is-right');
        audioCallGameSection.querySelector('.card-preview').classList.remove('inactive');
        errors.set(allWords[currentGame.currentWord].word, {
          wordTranslate: allWords[currentGame.currentWord].wordTranslate,
        });
        markRestAnswersAsIncorrect();
      } else if (isNext) {
        currentGame.setCurrentWord();
        updateContent();
        backgroundColorsHandler();
      }
      notKnowButton.classList.toggle('button-not-know');
      notKnowButton.classList.toggle('button-next');
    });
  }

  function answersHandler() {
    const { errors } = audiocallGameSettings.currentGame.statistics;
    const { learned } = audiocallGameSettings.currentGame.statistics;
    const optionsBlock = audioCallGameSection.querySelector('.block-with-words');
    let errorsCounter = 0;
    optionsBlock.addEventListener('click', (event) => {
      const guessWord = allWords[currentGame.currentWord];
      const button = event.target;
      const isRightAnswer = button.dataset.id === guessWord.word;
      button.classList.add(isRightAnswer ? 'is-right' : 'is-wrong');
      if (isRightAnswer) {
        audioCallGameSection.querySelector('.audiocall-button').classList.remove('button-not-know');
        audioCallGameSection.querySelector('.audiocall-button').classList.add('button-next');
        audioCallGameSection.querySelector('.card-preview').classList.remove('inactive');
        markRestAnswersAsIncorrect();

        if (errorsCounter === 0) learned.set(guessWord.word, { wordTranslate: guessWord.wordTranslate });
        errorsCounter = 0;
      } else {
        errorsCounter += 1;
        errors.set(guessWord.word, { wordTranslate: guessWord.wordTranslate });
      }
    });
  }

  function levelsBlockHandler() {
    const levelsBlock = document.querySelector('.levels-block');
    levelsBlock.addEventListener('click', async (event) => {
      const container = event.currentTarget;
      const gameLevelBlock = event.target;
      const currentLevel = gameLevelBlock.dataset.level;
      if (gameLevelBlock.tagName !== 'INPUT') return;
      if (container.dataset.level !== currentLevel) {
        container.dataset.level = currentLevel;
        localStorage.setItem('levelAudiocallGame', currentLevel);
        await audiocallGameSettings.getWords();
        updateContent();
      }
    });
  }

  function markRestAnswersAsIncorrect() {
    const optionsBlock = audioCallGameSection.querySelector('.block-with-words');
    optionsBlock.children.forEach(
      (answer) => answer.classList.contains('is-right') || answer.classList.add('is-wrong')
    );
  }
}

function createLevelsBlock() {
  const { currentLevel } = audiocallGameSettings;
  return `
  <div class="levels-container">
    <p class="levels-title">Уровень сложности:</p>
    <div class="levels-block" data-level="1">
        ${(() => {
          let acc = '';
          for (let level = 0; level <= 5; level++) {
            acc += `<input name="levels" type="radio" id="level-${level}" data-level='${level}' ${
              currentLevel === level ? 'checked' : ''
            }/><label class="level" for="level-${level}"></label>`;
          }
          return acc;
        })()}
    </div>
  </div>
  `;
}

async function getWordsByPartOfSpeech(word) {
  const words = await requestCreator({
    host: 'https://dictionary.skyeng.ru/api/public/v1',
    url: '/words/search',
    method: requestCreator.methods.get,
    data: { search: word },
  });
  const allowedPartOfSpeach = ['n', 'NN'];

  for (let index = 0; index <= words.length; index++) {
    const { meanings } = words[index];
    const meaning = meanings.find(({ partOfSpeechCode }) => allowedPartOfSpeach.includes(partOfSpeechCode));
    if (meaning) return meaning;
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function createGameStatistics() {
  const { body } = constants.DOM;
  const { errors, learned } = audiocallGameSettings.currentGame.statistics;
  const gameSection = body.querySelector('.audiocall-game-section');
  body.classList.remove('play-mode');
  body.classList.add('game-statistics');
  gameSection.innerHTML = '';
  gameSection.insertAdjacentHTML(
    'afterbegin',
    `
      <div class="statistics-block">
      <h2>Статистика игры:</h2>
      ${
        errors.size > 0
          ? `<p>Ошибок<span class="errors-amount">${errors.size}</span></p>
      <div class="errors-words">
      ${Array.from(errors)
        .map(
          (error) =>
            `<div class="word-in-statistics"><div>${error[0]}</div><span>—</span>
        <div class="translation">${error[1].wordTranslate}</div></div>`
        )
        .join('')}`
          : ''
      }
      ${
        learned.size > 0
          ? `<p>Знаю<span class="learned-amount">${learned.size}</span></p>
      <div class="learned-words">
      ${Array.from(learned)
        .map(
          (learnedWord) =>
            `<div class="word-in-statistics"><div>${learnedWord[0]}</div>
        <div class="translation"><span>—</span>${learnedWord[1].wordTranslate}</div></div>`
        )
        .join('')}`
          : ''
      }
       <div class="buttons-block">
      <a type="button" class="btn btn-info button-play-next">Играть дальше</a>
      <a type="button" class="btn btn-info" href="${routesMap.get(routeKeys.home).url}">Ко всем играм</a>
        </div>
      </div>
      `
  );
  buttonPlayNextHandler();
  function buttonPlayNextHandler() {
    gameSection.querySelector('button-play-next').addEventListener('click', playAudiocallGame);
  }
}

function backgroundColorsHandler() {
  const { body } = document;
  const { maxWordsLength } = audiocallGameSettings.currentGame;
  const currentHue = +body.style.getPropertyValue('--background-hue');
  const finishHueValue = 90;
  const step = finishHueValue / maxWordsLength;
  body.style.setProperty('--background-hue', currentHue ? currentHue + step : 20);
}
