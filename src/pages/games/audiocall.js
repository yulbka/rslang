import { constants } from 'js/constants';
import { requestCreator } from 'utils/requests';
import { store } from 'store/index';
import { WordService } from 'scripts/service/Word.Service';

export const audiocallGameSettings = {
  currentGame: {
    currentWord: 0,
    max: 10,
    variants: 5,
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
  body.classList.add('audiocall-game', 'start-screen');
  main.insertAdjacentHTML(
    'afterbegin',
    `
        <section class="audiocall-game-section container"></section>
        `
  );

  /*   createStartScreen();*/
  await audiocallGameSettings.getWords();
  playAudiocallGame();
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

  function renderContent() {
    const guessWord = allWords[currentGame.currentWord]; //TODO: random
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

      return Object.values(answersMap); //TODO: random sort
    })();

    return `
            <img class="card-img" src='https://raw.githubusercontent.com/MariannaV/rslang-data/master/${
              guessWord.image
            }' />
            <div class="word-description">
              <img class="sound-img" src=${require('assets/img/icons/sound.svg').default} />
              <p class="hidden-word">${guessWord.word}</p>
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
    //run audio
    answersHandler();
  }

  levelsBlockHandler();
  gameButtonHandler();
  answersHandler();

  function gameButtonHandler() {
    const notKnowButton = audioCallGameSection.querySelector('.button-not-know');
    notKnowButton.addEventListener('click', () => {
      if (notKnowButton.classList.contains('button-not-know')) {
        audiocallGameSettings.currentGame.currentWord++;
        //set class to right answer
      } else updateContent();

      notKnowButton.classList.toggle('button-not-know');
      notKnowButton.classList.toggle('button-next');
    });
  }

  function answersHandler() {
    const optionsBlock = audioCallGameSection.querySelector('.block-with-words');
    optionsBlock.addEventListener('click', (event) => {
      const guessWord = allWords[currentGame.currentWord];
      const button = event.target;
      const isRightAnswer = button.dataset.id === guessWord.word;
      button.classList.add(isRightAnswer ? 'is-right' : 'is-wrong');
      if (isRightAnswer) {
        audiocallGameSettings.currentGame.currentWord++;
        setTimeout(updateContent, 500);
      }
    });
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

function levelsBlockHandler() {
  const levelsBlock = document.querySelector('.levels-block');
  levelsBlock.addEventListener('click', (event) => {
    const container = event.currentTarget;
    const gameLevelBlock = event.target;
    const currentLevel = gameLevelBlock.dataset.level;
    container.dataset.level = '';
    container.dataset.level = currentLevel;
    localStorage.setItem('levelAudiocallGame', currentLevel);
  });
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
