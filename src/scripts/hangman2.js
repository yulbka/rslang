import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../css/hangman2.scss';
import { WordService } from './service/Word.Service';

export function create_hangman2() {
  document.body.className = 'hangman-game';
  const main = gId('main');
  const new_arr = [];
  let level = 0;
  let new_words;

  function create_main() {
    const new_main = `
        <div id="home">
                <div class="title">Висельница</div>
                <div class="button anim" id='startGame'>Играть</div>
                <div class='rules'>
                    <p class='rules_text'>Правила игры:</p>
                    <ul class='rules_ul'>
                        <li>выберете букву</li>
                        <li>если буква правильная, продолжайте</li>
                        <li>если буква не правильная, вы увидите постройку висельницы</li>
                        <li>если вы допустили 4 ошибки, используйте подсказку (нажмите на значок '?')</li>
                        <li>продолжайте играть до победы или поражения</li>
                        <li>сыграйте ещё партейку</li>
                    </ul>
                    <p class='rules_text'>Удачи!!!</p>
                </div>
            </div>
            <div id="result" class="h">
                <div class="title" id="rT"></div>
                <div class="body" id="rM"></div>
                <div class="button anim" id='startGameAgain'>Попоробовать снова?</div>
            </div>
            <div id="pGame">
                <div id="letter"></div>
                <div id="game">
                    <div class="player">
                        <div class="playerModel">
                            <div class="head" data="false" id="g4"></div>
                            <div class="body" data="false" l="false" r="false" id="g5"></div>
                            <div class="foot" data="false" l="false" r="false" id="g6"></div>
                        </div>
                    </div>
                    <div class="stang3" data="false" id="g3"></div>
                    <div class="stang2" data="false" id="g2"></div>
                    <div class="stang" data="false" id="g1"></div>
                    <div class="ground" data="false" id="g0"></div>
                    <div class="hintButton" data="false" id="hintButton">?</div>
                </div>
                <div id="tastatur">
                    <div id="moveKeybord"><div class="marg"></div></div>
                    <div id="keybord"></div>
                </div>
                <div class="hint" id="hint">
                    <div class="title">Hint<div class="exit" id='hintExit'>X</div></div>
                    <div class="body" id="hintText"></div>
                </div>
                <div class='game_levels' id='game_levels'>
                    <div><button type="button" class="btn btn-primary my_button" id='first_level'>Уровень 1</button><br></div>
                    <div><button type="button" class="btn btn-primary my_button" id='second_level'>Уровень 2</button><br></div>
                    <div><button type="button" class="btn btn-success my_button" id='third_level'>Уровень 3</button><br></div>
                    <div><button type="button" class="btn btn-info my_button" id='fourth_level'>Уровень 4</button><br></div>
                    <div><button type="button" class="btn btn-warning my_button" id='fifth_level'>Уровень 5</button><br></div>
                    <div><button type="button" class="btn btn-danger my_button" id='fixth_level'>Уровень 6</button></div>
                </div>
            </div>
        `;
    main.innerHTML += new_main;
  }

  create_main();

  function get_words_by_hier_level(lvl) {
    WordService.getWordsByLevelAndPage(lvl).then((data) => newGame(data));
  }

  gId('game_levels').addEventListener('click', (e) => {
    const target = e.target.closest('button');
    if (target.id === 'first_level') {
      level = 0;
      get_words_by_hier_level(level, 0);
    }
    if (target.id === 'second_level') {
      level = 1;
      get_words_by_hier_level(level, 0);
    }
    if (target.id === 'third_level') {
      level = 2;
      get_words_by_hier_level(level, 0);
    }
    if (target.id === 'fourth_level') {
      level = 3;
      get_words_by_hier_level(level, 0);
    }
    if (target.id === 'fifth_level') {
      level = 4;
      get_words_by_hier_level(level, 0);
    }
    if (target.id === 'fixth_level') {
      level = 5;
      get_words_by_hier_level(level, 0);
    }
  });

  const tastatur = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let select = 0;
  let wordLeft = [];
  let fail = 0;

  window.onload = function () {
    gId('moveKeybord').addEventListener(
      'touchmove',
      function (e) {
        const wH = window.innerHeight;
        const tY = e.touches[0].clientY;
        const eL = gId('tastatur');
        let resY = wH - tY - eL.offsetHeight;
        if (resY < 0) {
          resY = 0;
        } else if (resY > wH / 2) {
          resY = wH / 2;
        }
        eL.style.bottom = `${resY}px`;
      },
      false
    );
    createTastur();
  };

  createTastur();

  function startGame() {
    gId('home').className = 'h';
    gId('result').className = 'h';
    newGame();
  }

  gId('startGame').addEventListener('click', () => {
    startGame();
  });

  gId('startGameAgain').addEventListener('click', () => {
    startGame();
  });

  function newGame(data) {
    clearTastatur();
    clearPlayer();
    createWord(data);
  }

  function clearTastatur() {
    const e = document.getElementsByClassName('b');
    for (let a = 0; a < e.length; a++) {
      e[a].setAttribute('data', '');
    }
  }

  function clearPlayer() {
    fail = 0;
    wordLeft = [];
    gId('g0').setAttribute('data', 'false');
    gId('g1').setAttribute('data', 'false');
    gId('g2').setAttribute('data', 'false');
    gId('g3').setAttribute('data', 'false');
    gId('g4').setAttribute('data', 'false');
    gId('g5').setAttribute('data', 'false');
    gId('g5').setAttribute('r', 'false');
    gId('g5').setAttribute('l', 'false');
    gId('g6').setAttribute('data', 'false');
    gId('g6').setAttribute('l', 'false');
    gId('g6').setAttribute('r', 'false');
    gId('hintButton').setAttribute('data', 'false');
    gId('hint').style.display = 'none';
  }

  async function createWord(data) {
    if (data === undefined) {
      new_words = await WordService.getWordsByCategory('learned');
      if (new_words.length < 10) {
        new_words = await WordService.getNewWords();
      }
    }
    if (data !== undefined) {
      new_words = data;
    }
    new_words.map((item) => new_arr.push([item.word, item.textMeaning, item._id]));
    const d = gId('letter');
    d.innerHTML = '';
    select = Math.floor(Math.random() * new_arr.length);
    for (let a = 0; a < new_arr[select][0].length; a++) {
      const x = new_arr[select][0][a].toUpperCase();
      const b = document.createElement('span');
      b.className = `l${x === ' ' ? ' ls' : ''}`;
      b.innerHTML = '&nbsp';
      b.id = `l${a}`;
      d.appendChild(b);

      if (x !== ' ') {
        if (wordLeft.indexOf(x) === -1) {
          wordLeft.push(x);
        }
      }
    }
  }

  function createTastur() {
    const tas = gId('keybord');
    tas.innerHTML = '';
    for (let a = 0; a < tastatur.length; a++) {
      const b = document.createElement('span');
      b.className = 'b';
      b.innerText = tastatur[a];
      b.setAttribute('data', '');
      b.onclick = function () {
        bTas(this);
      };
      tas.appendChild(b);
    }
  }

  function bTas(a) {
    if (a.getAttribute('data') === '') {
      const x = isExist(a.innerText);
      console.log(x);
      a.setAttribute('data', x);
      if (x) {
        if (wordLeft.length === 0) {
          gameEnd(true);
        }
      } else {
        showNextFail();
      }
    }
  }

  function isExist(e) {
    e.toUpperCase();
    const x = wordLeft.indexOf(e);
    if (x !== -1) {
      wordLeft.splice(x, 1);
      typeWord(e);
      return true;
    }
    return false;
  }

  function showNextFail() {
    fail++;
    switch (fail) {
      case 1:
        gId('g0').setAttribute('data', 'true');
        break;

      case 2:
        gId('g1').setAttribute('data', 'true');
        break;

      case 3:
        gId('g2').setAttribute('data', 'true');
        break;

      case 4:
        gId('g3').setAttribute('data', 'true');
        gId('hintButton').setAttribute('data', 'true');
        break;

      case 5:
        gId('g4').setAttribute('data', 'true');
        break;

      case 6:
        gId('g5').setAttribute('data', 'true');
        break;

      case 7:
        gId('g5').setAttribute('l', 'true');
        break;

      case 8:
        gId('g5').setAttribute('r', 'true');
        break;

      case 9:
        gId('g6').setAttribute('data', 'true');
        gId('g6').setAttribute('l', 'true');
        break;

      case 10:
        gId('g6').setAttribute('r', 'true');
        gameEnd(false);
        break;
      default:
        console.log('default');
    }
  }

  function typeWord(e) {
    for (let a = 0; a < new_arr[select][0].length; a++) {
      if (new_arr[select][0][a].toUpperCase() === e) {
        gId(`l${a}`).innerText = e;
      }
    }
  }

  function gameEnd(e) {
    const d = gId('result');
    d.setAttribute('data', e);
    if (e) {
      gId('rT').innerText = 'Ты победил!';
      gId('rM').innerHTML = 'Поздравляю, ты правильно отгадал слово!<br/><br/>Отличная работа!';
      // wincount += 1;
    } else {
      gId('rT').innerText = 'Ты проиграл!';
      gId('rM').innerHTML = `Слово было - ${new_arr[select][0].toUpperCase()}. Удачи в следующей игре!.`;
      // losecount += 1;
      WordService.writeMistake(new_arr[select][2]);
    }
    d.className = '';
  }

  function hint() {
    const str = `${new_arr[select][1]}`;
    const newstr = str.replace(`${new_arr[select][0]}`, 'Needed word');
    gId('hintText').innerText = newstr;
    gId('hint').style.display = 'block';
  }

  gId('hintButton').addEventListener('click', () => {
    hint();
  });

  function hintExit() {
    gId('hint').style.display = 'none';
  }
  gId('hintExit').addEventListener('click', () => {
    hintExit();
  });

  function gId(a) {
    return document.getElementById(a);
  }
}
