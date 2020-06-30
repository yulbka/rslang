import {constants} from 'js/constants';

export function audioCallGameCreate() {
    const {main} = constants.DOM;
    main.insertAdjacentHTML('afterbegin',
        `
        <section class="audiocall-game-section"></section>
        `);
    createStartScreen();
}

function createStartScreen() {
    const {body} = constants.DOM;
    body.classList.add('audiocall-game', 'start-screen');
    createButtonStart();
}

async function timer() {
    const {audioCallGameSection} = constants.DOM;
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
    const {audioCallGameSection} = constants.DOM;
    audioCallGameSection.insertAdjacentHTML(
        'afterbegin',
        `
  <button class='begin-audiocall btn btn-outline-light'>Начать игру</button>`
    );
    const playButton = audioCallGameSection.querySelector('.begin-audiocall');
    playButton.addEventListener('click', timer);
}

function playAudiocallGame() {
    const {body} = constants.DOM;
    body.classList.remove('start-screen');
    body.classList.add('play-mode');
    console.log('AudioGAME');
    const {audioCallGameSection} = constants.DOM;
    audioCallGameSection.innerHTML = 'GAME';
}
