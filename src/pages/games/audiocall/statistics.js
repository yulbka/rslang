import {Statistics} from "scripts/Statistics";
import {audiocallGameSettings} from "store/gameAudioCall";
import {constants} from "js/constants";
import {routeKeys, routesMap} from "scripts/helpers/variables";
import { playAudiocallGame } from './index'

export async function sendStatistics() {
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

export function createGameStatistics() {
    const { body } = constants.DOM;
    const { errors, learned } = audiocallGameSettings.currentGame.statistics;
    const gameSection = body.querySelector('.audiocall-game-section');
    gameSection.className = 'audiocall-game-section container';
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
      <a type="button" class="btn btn-info long-statistics">Вся статистика по игре</a>
        </div>
      </div>
      `
    );
    buttonPlayNextHandler();
    buttonLongStatisticsHandler();

    function buttonPlayNextHandler() {
        gameSection.querySelector('.button-play-next').addEventListener('click', playAudiocallGame);
    }

    function buttonLongStatisticsHandler() {
        gameSection.querySelector('.long-statistics').addEventListener('click', createLongStatistics);
    }
}

async function createLongStatistics() {
    const allStatistics = await Statistics.get();
    const { audiocallGame: longStatistics } = allStatistics.optional;
    const audiocallGameSection = document.querySelector('.audiocall-game-section');
    audiocallGameSection.innerHTML = '';
    audiocallGameSection.className = 'audiocall-game-section long-statistics container';
    audiocallGameSection.insertAdjacentHTML(
        'afterbegin',
        `<div class="statistics-block">
            <h2>Статистика за все время:</h2>
            <div class="all-long-statistics">
                ${(() => {
            const arr = [];
            for (const [key, value] of Object.entries(longStatistics)) {
                arr.push(
                    `<div class="statistics-one-day">
                          <div class="statisctics-date">
                                <p>Дата:</p>
                                <p>${key}</p>
                          </div>
                          <div class="statistics-results">
                            <div class="">Результаты:</div>
                            <div>ошибки / правильно</div>
                            <div class="all-results">
                                ${value
                        .map(
                            (el) => `
                                    <div class="one-game-statistics">
                                        <p><span class="learned-amount">${el.learned}</span></p>
                                        <p>/<span class="errors-amount">${el.errors}</span></p>
                                    </div>
                                  `
                        )
                        .join('')}
                            </div>
                          </div>
                      </div> 
                      `
                );
            }
            return arr.join('');
        })()}
            </div>    
            <div class="buttons-block">
              <a type="button" class="btn btn-info button-play-next">Играть дальше</a>
              <a type="button" class="btn btn-info" href="${routesMap.get(routeKeys.home).url}">Ко всем играм</a>
            </div>
        </div>  
`
    );
}