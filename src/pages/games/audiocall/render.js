import { store } from 'store';
import { constants } from 'js/constants';
import { playAudiocallGame, gameReset } from 'pages/games/audiocall/game';

const { audiocallGame: audiocallGameSettings } = store;

export function createLevelsBlock() {
  const { currentLevel } = audiocallGameSettings;
  const renderLevels = () => {
    let acc = '';
    for (let level = 0; level <= 5; level++) {
      acc += `<input name="levels" type="radio" id="level-${level}" data-level='${level}' ${
        currentLevel === level ? 'checked' : ''
      }/><label class="level" for="level-${level}"></label>`;
    }
    return acc;
  };
  return `
      <div class="levels-container">
        <p class="levels-title">Уровень сложности:</p>
        <div class="levels-block">
            ${renderLevels()}
        </div>
      </div>
  `;
}

export function createButtonStart() {
  const { audioCallGameSection } = constants.DOM;
  audioCallGameSection.insertAdjacentHTML(
    'beforeend',
    `<button class='begin-audiocall btn btn-outline-light'>Начать игру</button>`
  );
  const playButton = audioCallGameSection.querySelector('.begin-audiocall');
  playButton.addEventListener('click', timer);
}

export async function timer() {
  gameReset();
  const { audioCallGameSection, body } = constants.DOM;
  const timerSeconds = 3;
  body.classList.remove('play-mode');
  if (!body.classList.contains('start-screen')) {
    body.classList.add('start-screen');
  }
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
