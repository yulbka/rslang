import './mainApp';
import { loadAllWords, startGame } from './script';

export async function renderSprint() {
  document.body.classList.add('sprint');
  await loadAllWords();
  document.getElementById('main').insertAdjacentHTML(
    'beforeend',
    `
    <div class="container-fluid d-flex flex-position">

        <div class="time text-center" id="countdown">15</div>

        <div class="row question">

            <div class="answer-score col-3 d-flex text-center flex-position">
                <span class="answer-score__title">Баллы за вопрос</span>
                <span class="score-value" id="answerValue">10</span>
            </div>

            <div class="question-card col-6 d-flex">
                <div id="current-word" class="text-center">jetlag</div>
                <div id="current-word-translation" class="text-center">должностная инструкция</div>
            </div>

            <div class="total-score col-3 d-flex text-center flex-position">
                <span class="total-score__title">Всего баллов</span>
                <span id="score" class="score-value">0</span>
            </div>

        </div>

        <div class="answer-buttons text-center">
            <button type="button" class="positive-button" id="positive-button">верно</button>
            <button type="button" class="negative-button" id="negative-button">неверно</button>
        </div>

    </div>
    `
  );

  startGame();
}
