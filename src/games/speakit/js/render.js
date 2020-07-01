export function renderSpeakIt() {
  document.body.insertAdjacentHTML(
    'beforeend',
    `
    <div class="background">
      <main class="main">
        <div class="start">
          <h1 class="start__title">SpeakIt</h1>
          <p class="start__text">You should tell words into microphone</p>
          <a class="btn btn__start">Start</a>
        </div>
        <div class="speak">
          <section class="level level-select">
            <p class="level__text"></p>
            <input type="radio" id="level0" name="levels" value="0" checked />
            <label class="level__label" for="level0"></label>
            <input type="radio" id="level1" name="levels" value="1" />
            <label class="level__label" for="level1"></label>
            <input type="radio" id="level2" name="levels" value="2" />
            <label class="level__label" for="level2"></label>
            <input type="radio" id="level3" name="levels" value="3" />
            <label class="level__label" for="level3"></label>
            <input type="radio" id="level4" name="levels" value="4" />
            <label class="level__label" for="level4"></label>
            <input type="radio" id="level5" name="levels" value="5" />
            <label class="level__label" for="level5"></label>
          </section>
          <div class="divider"></div>
          <section class="word">
            <img class="word__img" src="" alt="" />
            <p class="word__translation"></p>
            <p class="word__recognition"></p>
            <div class="btns">
              <a class="btn btn__restart">Restart</a>
              <a class="btn btn__speak">Speak</a>
              <a class="btn btn__results">Results</a>
            </div>
            <div class="word__items items"></div>
          </section>
        </div>
        <div class="results hidden">
          <div class="results__table">
            <p class="right__text">Correct <span class="right__count"></span></p>
            <div class="right__items"></div>
            <p class="wrong__text">Mistake <span class="wrong__count"></span></p>
            <div class="wrong__items"></div>
            <div class="btns">
              <a class="btn btn__return">Return</a>
              <a class="btn btn__new-game">New game</a>
            </div>
          </div>
        </div>
      </main>
    </div>
    `
  );
}
