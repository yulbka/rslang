import { constants } from 'js/constants';
import { store } from 'store/index';
import { createButtonStart } from 'pages/games/audiocall/render';

const { audiocallGame: audiocallGameSettings } = store;

export async function audioCallGameCreate() {
  const { main } = constants.DOM;
  const { body } = constants.DOM;
  body.classList.remove('content-page');
  body.classList.add('audiocall-game', 'start-screen');
  main.insertAdjacentHTML(
    'afterbegin',
    `
        <section class="audiocall-game-section container"></section>
        `
  );

  backgroundColorsHandler({ needReset: true });
  createStartScreen();
  await audiocallGameSettings.getWords();
}

export function createStartScreen() {
  const { audioCallGameSection } = constants.DOM;
  audioCallGameSection.insertAdjacentHTML(
    'afterbegin',
    `
      <h2 class="game-title">Аудиовызов</h2>
      <p class="game-description">После начала игры будет озвучено слово, необходимо выбрать перевод слова из пяти предложенных вариантов ответа.</p>
      `
  );
  createButtonStart();
}

export function backgroundColorsHandler({ needReset } = {}) {
  const { body } = document;
  const { maxWordsLength } = audiocallGameSettings.currentGame;
  const currentHue = needReset ? 0 : +body.style.getPropertyValue('--background-hue');
  const finishHueValue = 90;
  const step = finishHueValue / maxWordsLength;
  body.style.setProperty('--background-hue', currentHue ? currentHue + step : 20);
}
