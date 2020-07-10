import './dragAndDrop';
import { Sentence, book } from './Sentence';
import { GamePage } from './GamePage';
import { Puzzle, paintings } from './Puzzle';
import { createElement } from '../../scripts/helpers/createElement';
import { store } from '../../store';
import { API_USER } from '../../api/user';

export class Game {  
  constructor() {
    this._sentence = [];
    this._word;
    this._audio;
  }

  get sentence() {
    return this._sentence;
  }

  set sentence(sentence) {
    this._sentence = sentence;
  }

  get word() {
    return this._word;
  }

  set word(word) {
    this._word = word;
  }

  get audio() {
    return this._audio;
  }

  set audio(audio) {
    this._audio = audio;
  }

  static async init() {
    const { page, level } = await this.getSettings();
    GamePage.refreshPageDropList(book[level].length / 10);
    this.loadPage(page, level);
    this.checkHandler();
    this.answerHandler();
    this.continueHandler();
    // this.resultsHandler();
    this.pageHandler();
    this.levelHandler();
    this.autoPlay();
    this.picturePromptHandler();
    this.audioPromptHandler();
    this.translatePromptHandler();
  }

  static checkHandler() {
    const checkBtn = document.querySelector('.puzzle-btn_check');
    checkBtn.addEventListener('click', () => {
      const answerBtn = document.querySelector('.puzzle-btn_help');
      const puzzles = Array.from(document.querySelectorAll('.settled'));
      let countWrongs = 0;
      puzzles.forEach(async (puzzle, index) => {
        if (puzzle.dataset.word === this.sentence[index]) {
          localStorage.setItem(this.word.id, 'correct');
          Puzzle.paintStroke(puzzle, 'green');
        } else {
          Puzzle.paintStroke(puzzle, 'red');
          countWrongs += 1;
        }
      });
      countWrongs ? answerBtn.classList.remove('button_hidden'):
      this.sentenceCollected();
    });
  }

  static answerHandler() {
    const answerBtn = document.querySelector('.puzzle-btn_help');
    answerBtn.addEventListener('click', () => {
      const data = document.querySelector('.data');
      if (!data.children.length &&
        this.check.classList.contains('button_hidden')) return;
      const puzzles = document.querySelectorAll('.new');
      puzzles.forEach((puzzle) => {
        puzzle.classList.add('settled');
        puzzle.classList.remove('new');
      });
      this.sentenceCollected();
      localStorage.setItem(this.word.id, 'wrong');
    });
  }

  static continueHandler() {
    const continueBtn = document.querySelector('.puzzle-btn_continue');
    const answerBtn = document.querySelector('.puzzle-btn_help');
    continueBtn.addEventListener('click', async () => {
      this.checkAudioPrompt();
      if (!(this.results.classList.contains('button_hidden'))) {
        const { page, level } = store.user.englishPuzzle;
        this.loadPage(page, level);
      } else {
        this.finishRow();
        const translate = document.querySelector('.prompt__text');
        translate.textContent = '';
        continueBtn.classList.add('button_hidden');
        answerBtn.classList.remove('button_hidden');
        await this.goToNextRow();
      }
    });
  }

  // resultsHandler() {
  //   const resultsBtn =
  //   document.querySelector('.button_results');
  //   resultsBtn.addEventListener('click', () => {
  //     GAME_CONTAINER.innerHTML = '';
  //     new ResultsPage(this.levelDropList.value, this.pageDropList.value).init();
  //   });
  // }

  static pageHandler() {
    const pageDropList = document.querySelector('.page__droplist');
    const levelDropList = document.querySelector('.level__droplist');
    pageDropList.addEventListener('change', async () => {
      this.loadPage(pageDropList.value, levelDropList.value);
    });
  }

  static levelHandler() {
    const levelDropList = document.querySelector('.level__droplist');
    levelDropList.addEventListener('change', async () => {
      this.loadPage(1, levelDropList.value);
    });
  }

  static picturePromptHandler() {
    const picturePrompt = document.querySelector('.picture');
    if (!picturePrompt) return;
    picturePrompt.addEventListener('click', async () => {
      const page = document.querySelector('.page__droplist').value;
      const level = document.querySelector('.level__droplist').value;
      picturePrompt.classList.toggle('prompt-btn_active');
      picturePrompt.classList.contains('prompt-btn_active') ?
      await this.updateSettings({ background: true }):
      await this.updateSettings({ background: false });
      const rowPosition = findCurrentRow();
      const puzzles = document.querySelectorAll('.new');
      puzzles.forEach((puzzle) => {
        picturePrompt.classList.contains('prompt-btn_active') ?
        Puzzle.showPicture(puzzle, puzzle.dataset.position,
            rowPosition - 1, level, page):
        Puzzle.fillPuzzle(puzzle, '#b6ab98');
        Puzzle.paintStroke(puzzle, 'lightgrey');
      });
    });
  }

  static audioPromptHandler() {
    const audioPrompt = document.querySelector('.note');
    if (!audioPrompt) return;
    audioPrompt.addEventListener('click', async () => {
      const playButton = document.querySelector('.prompt__button');
      audioPrompt.classList.toggle('prompt-btn_active');
      playButton.removeEventListener('click', this.audioPlay);
      if (audioPrompt.classList.contains('prompt-btn_active')) {
        await this.updateSettings({ audio: true });
        playButton.addEventListener('click', this.audioPlay);
      } else {
        playButton.removeEventListener('click', this.audioPlay);
        await this.updateSettings({ audio: false });
      }
    });
  }

  static checkAudioPrompt() {
    const audioPrompt = document.querySelector('.note');
    if (!audioPrompt.classList.contains('prompt-btn_active')) {
      this.playButton.removeEventListener('click', this.audioPlay);
    }
  }

  static translatePromptHandler() {
    const translatePrompt = document.querySelector('.text');
    if (!translatePrompt) return;
    translatePrompt.addEventListener('click', async () => {
      const prompt = document.querySelector('.prompt__text');
      translatePrompt.classList.toggle('prompt-btn_active');
      translatePrompt.classList.contains('prompt-btn_active') ?
      await this.updateSettings({ translate: true }):
      await this.updateSettings({ translate: false });
      prompt.textContent = '';
      if (translatePrompt.classList.contains('prompt-btn_active')) {
        const level = document.querySelector('.level__droplist').value;
        const page = document.querySelector('.page__droplist').value;
        const round = findCurrentRow();
        Sentence.translateSentence(level, page, round);
      }
    });
  }

  static autoPlay() {
    const autoPlayPrompt =
    document.querySelector('.voice');
    if (!autoPlayPrompt) return;
    autoPlayPrompt.addEventListener('click', async () => {
      autoPlayPrompt.classList.toggle('prompt-btn_active');
      autoPlayPrompt.classList.contains('prompt-btn_active') ?
      await this.updateSettings({ auto: true }):
      await this.updateSettings({ auto: false });
    });
  }

  static checkAutoPlay() {
    const autoPlay = document.querySelector('.voice');
    if (autoPlay.classList.contains('btn_active')) {
      this.audio.play();
    }
  }

  static async loadPage(page, level) {
    GamePage.refreshPageDropList(book[level].length / 10);
    await this.updateSettings({ page, level });
    clearGameField();
    GamePage.renderResultBlock();
    const pageDropList = document.querySelector('.page__droplist');
    const levelDropList = document.querySelector('.level__droplist');
    pageDropList.value = `${page}`;
    levelDropList.value = `${level}`;
    this.word = Sentence.getWordData(level, page, 1);
    this.audio = Sentence.loadSentencePronounce(this.word.audio);
    document.querySelector('.puzzle-row').classList.add('puzzle-row_active');
    this.sentence = Sentence.render(this.word.textExample, level, page, 1);
    this.resetButtons();
  }

  static async getSettings() {
    const settings = await API_USER.getUserSettings({ userId: localStorage.getItem('userId') });
    console.log(settings.englishPuzzle)
    store.user.englishPuzzle = settings.englishPuzzle;
    const { page, level, autoplay, translation, audio, background } = store.user.englishPuzzle;
    if (autoplay) {
        document.querySelector('.voice').classList.add('prompt-btn_active');
    }
    if (translation) {
      document.querySelector('.text').classList.add('prompt-btn_active');
    }
    if (audio) {
      document.querySelector('.note').classList.add('prompt-btn_active');
      const playBtn = document.querySelector('.prompt__button');
      playBtn.addEventListener('click', this.audioPlay);
    }
    if (background) {
      document.querySelector('.picture').classList.add('prompt-btn_active');
    }
    return { page, level };
  }

  static async updateSettings(updatedFields) {
    const settings = await API_USER.getUserSettings({ userId: localStorage.getItem('userId') });
    const { wordsPerDay, learning, englishPuzzle } = settings;
    const newSettings = await API_USER.setUserSettings({ userId: localStorage.getItem('userId'),
      userSettings: {
        wordsPerDay,
        optional: {
          learning,
          englishPuzzle: {
            ...englishPuzzle,
            ...updatedFields,
          },
        },
      } 
    });
    store.user.englishPuzzle = newSettings.englishPuzzle;
    console.log(newSettings);
  }

  static sentenceCollected() {
    const count = document.querySelector('.count');
    const rowIndex = Number(count.lastChild.textContent);
    const row =
      document.querySelector(`[data-row='${rowIndex}']`);
    const puzzles = Array.from(document.querySelectorAll('.settled'));
    puzzles.sort((a, b) => +a.dataset.position - +b.dataset.position);
    const fragment = document.createDocumentFragment();
    puzzles.forEach((puzzle) => {
      fragment.append(puzzle);
      Puzzle.showPicture(puzzle, puzzle.dataset.position, rowIndex - 1,
          this.levelDropList.value, this.pageDropList.value, 'green');
    });
    row.append(fragment);
    this.checkAutoPlay();
    Sentence.translateSentence(this.levelDropList.value,
        this.pageDropList.value, rowIndex);
    this.playButton.addEventListener('click', this.play);
    this.check.classList.add('button_hidden');
    this.answer.classList.add('button_hidden');
    this.continue.classList.remove('button_hidden');
  }

  static finishRow() {
    const puzzles = Array.from(document.querySelectorAll('.settled'));
    const row =
      document.querySelector(`[data-row='${findCurrentRow()}']`);
    row.classList.remove('row_active');
    puzzles.forEach((puzzle) => {
      Puzzle.paintStroke(puzzle, 'lightgrey');
      puzzle.classList.remove('new', 'settled');
      puzzle.classList.add('finished');
    });
  }

  static async goToNextRow() {
    let { page, level } = store.user.englishPuzzle;
    const rowIndex = findCurrentRow();
    if (rowIndex === 10) {
      // this.setStatistic();
      this.showPictureData(level, page);
      if (page === book[level].length / 10) {
          level === 6 ? level = 1: level += 1;
          page = 1;
          await this.updateSettings({ page, level });
      } else {
        page += 1;
        await this.updateSettings({ page });
      }
      this.answer.classList.add('button_hidden');
      this.results.classList.remove('button_hidden');
      this.continue.classList.remove('button_hidden');
    } else {
      const count = document.querySelector('.count');
      const numbers = count.querySelectorAll('.count__number');
      numbers.forEach((number) => {
        number.classList.remove('count__number_active');
      });
      createElement('div', count, ['count__number', 'count__number_active'],
          `${Number(rowIndex) + 1}`);
      this.word = Sentence.getWordData(level, page, rowIndex + 1);
      this.audio = Sentence.loadSentencePronounce(this.word.audio);
      this.sentence = Sentence.render(this.word.textExample,
          level, page, rowIndex + 1);
      const newRow =
        document.querySelector(`[data-row='${rowIndex + 1}']`);
      newRow.classList.add('row_active');
    }
  }

  static resetButtons() {
    const continueBtn = document.querySelector('.puzzle-btn_continue');
    const resultsBtn = document.querySelector('.puzzle-btn_results');
    const checkBtn = document.querySelector('.puzzle-btn_check');
    const answerBtn = document.querySelector('.puzzle-btn_help');
    const playBtn = document.querySelector('.prompt__button');
    continueBtn.classList.add('button_hidden');
    resultsBtn.classList.add('button_hidden');
    checkBtn.classList.add('button_hidden');
    answerBtn.classList.remove('button_hidden');
    playBtn.classList.remove('button_hidden');
  }

  static showPictureData(level, page) {
    const count = document.querySelector('.count');
    count.innerHTML = '';
    const container =
        document.querySelector('.result');
    container.innerHTML = '';
    this.playButton.classList.add('button_hidden');
    const picture = paintings[level][page - 1];
    const img = new Image(container.offsetWidth, container.offsetHeight);
    const src = picture.cutSrc;
    img.src = `https://raw.githubusercontent.com/Anna234365/rslang_data_paintings/master/${src}`;
    container.append(img);
    const pictureDescription =
    `${picture.author} - ${picture.name} (${picture.year})`;
    const data = document.querySelector('.data');
    createElement('p', data, ['picture-description'], pictureDescription);
  }

  static audioPlay = () => this.audio.play();

}

export function findCurrentRow() {
  const count = document.querySelector('.count');
  let rowIndex = 1;
  if (count.lastChild) {
    rowIndex = Number(count.lastChild.textContent);
  }
  return rowIndex;
}

export function clearGameField() {
  const container =
    document.querySelector('.result-container');
  if (!container) return;
  container.innerHTML = '';
  const data = document.querySelector('.data');
  if (!data) return;
  data.innerHTML = '';
}