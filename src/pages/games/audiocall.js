import { constants } from 'js/constants';
import { requestCreator } from 'utils/requests';
import { store } from 'store/index';
import { WordService } from 'scripts/service/Word.Service';
import { routesMap, routeKeys } from 'scripts/helpers/variables';
import { Statistics } from 'scripts/Statistics';
import { initRequests } from '../../index';

export const audiocallGameSettings = {
  currentGame: {
    currentWord: 0,
    setCurrentWord() {
      const isEndGame = this.statistics.learned.size + this.statistics.errors.size === this.maxWordsLength;
      if (isEndGame) {
        sendStatistics();
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
    maxWordsLength: 3,
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
  similarWordsMAp: new Map(),
  get wordsArray() {
    return Array.from(this.wordsMap.values());
  },
  async getWords() {
    const words = await WordService.getWordsByLevelAndPage(this.currentLevel, 0);
    words.forEach((gameWord) =>
      this.wordsMap.set(gameWord.word, {
        wordId: gameWord.id,
        word: gameWord.word,
        audio: gameWord.audio,
        image: gameWord.image,
        wordTranslate: gameWord.wordTranslate,
        level: gameWord.group,
      })
    );
  },
  async getSimilarWords(regexp = 'голь') {
    const similarWords = await requestCreator({
      url: `/users/${store.user.auth.userId}/aggregatedWords`,
      method: requestCreator.methods.get,
      data: { filter: JSON.stringify({ wordTranslate: { $regex: `\\w{0,}${regexp}\\w{0,}` } }) },
    });
    similarWords[0].paginatedResults.forEach((word) => this.similarWordsMAp.set(word, word.wordTranslate));
    return similarWords[0].paginatedResults;
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
  initRequests();
  /*  WordService.getAllUserWords()*/
  /*  WordService.getAllAggregatedWords()*/

  const forGames = await WordService.getWordsForGames();
  backgroundColorsHandler({ needReset: true });
  await audiocallGameSettings.getSimilarWords();
   createStartScreen();
  await audiocallGameSettings.getWords();
  /*playAudiocallGame();*/
}

function createStartScreen() {
  const { audioCallGameSection } = constants.DOM;
  audioCallGameSection.insertAdjacentHTML('afterbegin',
      `
      <h2 class="game-title">Аудиовызов</h2>
      <p class="game-description">После начала игры будет озвучено слово, необходимо выбрать перевод слова из пяти предложенных вариантов ответа.</p>
      `)
  createButtonStart();
}

async function timer() {
  const { audioCallGameSection, body } = constants.DOM;
  const timerSeconds = 3;
  body.classList.remove('play-mode');
  audioCallGameSection.innerHTML = '';
  audioCallGameSection.insertAdjacentHTML(
    'afterbegin',
    `
        <div class="timer">${timerSeconds}</div>
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
  const {  audioCallGameSection } = constants.DOM;
  audioCallGameSection.insertAdjacentHTML(
    'beforeend',
    `
  <button class='begin-audiocall btn btn-outline-light'>Начать игру</button>`
  );
  const playButton = audioCallGameSection.querySelector('.begin-audiocall');
  playButton.addEventListener('click', timer);
}

async function playAudiocallGame() {
  await initRequests();
  console.log(store);
  const { body } = constants.DOM;
  const { currentGame } = store.audiocallGame;
  const { wordsArray: allWords } = store.audiocallGame;
  const { audioCallGameSection } = constants.DOM;
  currentGame.setCurrentWord();
  body.className = 'audiocall-game play-mode';
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
  levelsBlockHandler();
  gameButtonHandler();
  answersHandlers();

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
                  `<p class="answer-word" data-key= ${index + 1} data-id=${word}><span>${
                    index + 1
                  }</span>${wordTranslate}</p>`
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
    answersHandlers();
  }

  async function playAudio() {
    const guessWord = allWords[currentGame.currentWord];
    const audioWord = new Audio(`https://raw.githubusercontent.com/MariannaV/rslang-data/master/${guessWord.audio}`);
    await audioWord.play();
  }

  function audioButtonHandler() {
    document.querySelector('.sound-img').addEventListener('click', playAudio);
  }

  function gameButtonHandler() {
    const { errors } = currentGame.statistics;
    const audiocallButton = audioCallGameSection.querySelector('.audiocall-button');
    audiocallButton.addEventListener('click', buttonHandler);
    document.addEventListener('keyup',() => {
      if (event.key === 'Enter'){
        buttonHandler();
      }
    });


    function buttonHandler(){
        const isNotKnow = audiocallButton.classList.contains('button-not-know');
        const isNext = audiocallButton.classList.contains('button-next');
        if (isNotKnow) {
          const correctAnswer = document.querySelector(`.answer-word[data-id=${allWords[currentGame.currentWord].word}]`);
          correctAnswer.classList.add('is-right');
          audioCallGameSection.querySelector('.card-preview').classList.remove('inactive');
          WordService.writeMistake(allWords[currentGame.currentWord].wordId);
          errors.set(allWords[currentGame.currentWord].word, {
            wordTranslate: allWords[currentGame.currentWord].wordTranslate,
          });
          markRestAnswersAsIncorrect();
        } else if (isNext) {
          currentGame.setCurrentWord();
          updateContent();
          backgroundColorsHandler();
        }
        audiocallButton.classList.toggle('button-not-know');
        audiocallButton.classList.toggle('button-next');
      }
  }

  function answersHandlers() {
    const { errors, learned } = audiocallGameSettings.currentGame.statistics;
    const audiocallButton = audioCallGameSection.querySelector('.audiocall-button');
    const optionsBlock = audioCallGameSection.querySelector('.block-with-words');
    let errorsCounter = 0;
    optionsBlock.addEventListener('click', answersHandler);

    document.addEventListener('keyup', answersHandler);
    function answersHandler(event) {
      const guessWord = allWords[currentGame.currentWord];
      let answerButton = null;
      console.log(event);

      switch (event.type) {
        case 'keyup': {
          const { key } = event;
          answerButton = optionsBlock.querySelector(`[data-key='${key}']`);
          break;
        }
        case 'click': {
          answerButton = event.target;
          break;
        }
        default:
          break;
      }
      const isRightAnswer = answerButton.dataset.id === guessWord.word;
      answerButton.classList.add(isRightAnswer ? 'is-right' : 'is-wrong');
      if (isRightAnswer) {
        audiocallButton.classList.remove('button-not-know');
        audiocallButton.classList.add('button-next');
        audioCallGameSection.querySelector('.card-preview').classList.remove('inactive');
        markRestAnswersAsIncorrect();
        if (errorsCounter === 0)
          learned.set(guessWord.word, {
            wordTranslate: guessWord.wordTranslate,
            audio: guessWord.audioCallGameSection,
          });
        errorsCounter = 0;
      } else {
        errorsCounter += 1;
        WordService.writeMistake(guessWord.wordId);
        errors.set(guessWord.word, {
          wordTranslate: guessWord.wordTranslate,
          audio: guessWord.audioCallGameSection,
        });
      }
    }
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
        createStartScreen();
        /* createButtonStart();*/
        backgroundColorsHandler({ needReset: true });
        timer();
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
            `<div class="word-in-statistics"><button onclick=""></button><div>${error[0]}</div><span>—</span>
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
      <a type="button" class="btn btn-info">Статистика игр</a>
        </div>
      </div>
      `
  );
  buttonPlayNextHandler();

  function buttonPlayNextHandler() {
    gameSection.querySelector('.button-play-next').addEventListener('click', playAudiocallGame);
  }
}

function backgroundColorsHandler({ needReset } = {}) {
  const { body } = document;
  const { maxWordsLength } = audiocallGameSettings.currentGame;
  const currentHue = needReset ? 0 : +body.style.getPropertyValue('--background-hue');
  const finishHueValue = 90;
  const step = finishHueValue / maxWordsLength;
  body.style.setProperty('--background-hue', currentHue ? currentHue + step : 20);
}

async function sendStatistics() {
  const allStatistics = await Statistics.get();
  delete allStatistics.id;
  allStatistics.optional.audiocallGame = (() => {
    const today = new Date().toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' });
    const { audiocallGame = {} } = allStatistics.optional;
    if (!audiocallGame[today]) audiocallGame[today] = [];
    audiocallGame[today].push(
      ['learned', 'errors'].reduce((resAcc, fieldKey) => {
        // eslint-disable-next-line no-param-reassign
        resAcc[fieldKey] = audiocallGameSettings.currentGame.statistics[fieldKey].size;
        return resAcc;
      }, {})
    );
    return audiocallGame;
  })();
  await Statistics.set(allStatistics);
}


