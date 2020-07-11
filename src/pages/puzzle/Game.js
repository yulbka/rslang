import './dragAndDrop';
import { Sentence, book } from './Sentence';
import { GamePage } from './GamePage';
import { Puzzle, paintings } from './Puzzle';
import { createElement } from '../../scripts/helpers/createElement';
import { store } from '../../store';
import { API_USER } from '../../api/user';
import { MAIN } from '../../scripts/helpers/variables';
import { ResultsPage } from './ResultsPage';
import { WordService } from '../../scripts/service/Word.Service';

export class Game {  
  constructor() {
    this._sentence = [];
    this._firstWord;
    this._word;
    this._audio;
  }

  get firstWord() {
    return this._firstWord;
  }

  set firstWord(word) {
    this._firstWord = word;
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
    const { page, level, useLearnedWords } = await this.getSettings();
    if (useLearnedWords) {
      await this.disableDropLists();
    }
    const checkbox = document.querySelector('#customSwitch');
    if (!checkbox.checked) {
      await this.loadPage(page, level);
    }
    this.checkHandler();
    this.answerHandler();
    this.continueHandler();
    this.resultsHandler();
    this.pageHandler();
    this.levelHandler();
    this.autoPlay();
    this.picturePromptHandler();
    this.audioPromptHandler();
    this.translatePromptHandler();
    this.handleCheckbox();
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
      countWrongs ? answerBtn.classList.remove('btn_hidden'):
      this.sentenceCollected();
    });
  }

  static answerHandler() {
    const answerBtn = document.querySelector('.puzzle-btn_help');
    answerBtn.addEventListener('click', () => {
      const checkBtn = document.querySelector('.puzzle-btn_check');
      const data = document.querySelector('.data');
      if (!data.children.length &&
        checkBtn.classList.contains('btn_hidden')) return;
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
    const resultsBtn = document.querySelector('.puzzle-btn_results');
    continueBtn.addEventListener('click', async () => {
      const pageDropList = document.querySelector('.page__droplist');
      const levelDropList = document.querySelector('.level__droplist');
      this.checkAudioPrompt();
      if (!(resultsBtn.classList.contains('btn_hidden'))) {
        if (pageDropList.selectedIndex === -1) {
          clearGameField();
          GamePage.renderResultBlock();
          this.newWord = await WordService.getWordsForGames(1);
          this.word = this.newWord;
          this.audio = Sentence.loadSentencePronounce(this.word.audioExample);
          document.querySelector('.puzzle-row').classList.add('puzzle-row_active');
          this.sentence = Sentence.render(this.word.textExample, this.word.group, this.word.page, 1);
          this.resetButtons();
        } else {
          const page = +pageDropList.value;
          const level = +levelDropList.value;
          this.loadPage(page + 1, level);
        }        
      } else {
        this.finishRow();
        const translate = document.querySelector('.prompt__text');
        translate.textContent = '';
        continueBtn.classList.add('btn_hidden');
        answerBtn.classList.remove('btn_hidden');
        await this.goToNextRow();
      }
    });
  }

  static resultsHandler() {
    const resultsBtn =
    document.querySelector('.puzzle-btn_results');
    resultsBtn.addEventListener('click', () => {
      const level = +document.querySelector('.level__droplist').value;
      const page = +document.querySelector('.page__droplist').value;
      MAIN.innerHTML = '';
      new ResultsPage(level, page).init();
    });
  }

  static pageHandler() {
    const pageDropList = document.querySelector('.page__droplist');
    const levelDropList = document.querySelector('.level__droplist');
    pageDropList.addEventListener('change', async () => {
      this.loadPage(+pageDropList.value, +levelDropList.value);
    });
  }

  static levelHandler() {
    const levelDropList = document.querySelector('.level__droplist');
    levelDropList.addEventListener('change', async () => {
      this.loadPage(1, +levelDropList.value);
    });
  }

  static picturePromptHandler() {
    const picturePrompt = document.querySelector('.picture');
    if (!picturePrompt) return;
    picturePrompt.addEventListener('click', async () => {
      picturePrompt.classList.toggle('prompt-btn_active');
      picturePrompt.classList.contains('prompt-btn_active') ?
      await this.updateSettings({ background: true }):
      await this.updateSettings({ background: false });
      const rowPosition = findCurrentRow();
      const puzzles = document.querySelectorAll('.new');
      const checkbox = document.querySelector('#customSwitch');
      const levelDropList = document.querySelector('.level__droplist');
      const level = checkbox.checked ? this.firstWord.group: +levelDropList.value - 1;
      const pageDropList = document.querySelector('.page__droplist');
      const page = checkbox.checked ? this.firstWord.page: +pageDropList.value - 1;
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
    const playButton = document.querySelector('.prompt__button');
    if (!audioPrompt.classList.contains('prompt-btn_active')) {
      playButton.removeEventListener('click', this.audioPlay);
    }
  }

  static translatePromptHandler() {
    const translatePrompt = document.querySelector('.text');
    if (!translatePrompt) return;
    translatePrompt.addEventListener('click', async () => {
      const prompt = document.querySelector('.prompt__text');
      prompt.textContent = '';
      translatePrompt.classList.toggle('prompt-btn_active');
      translatePrompt.classList.contains('prompt-btn_active') ?
      await this.updateSettings({ translation: true }):
      await this.updateSettings({ translation: false });
      if (translatePrompt.classList.contains('prompt-btn_active')) {
        const checkbox = document.querySelector('#customSwitch');
        const level = checkbox.checked ? this.word.group: +document.querySelector('.level__droplist').value;
        const page = checkbox.checked ? this.word.page: +document.querySelector('.page__droplist').value; 
        const round = findCurrentRow();
        console.log(level, page, round)
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
      await this.updateSettings({ autoplay: true }):
      await this.updateSettings({ autoplay: false });
    });
  }

  static checkAutoPlay() {
    const autoPlay = document.querySelector('.voice');
    if (autoPlay.classList.contains('prompt-btn_active')) {
      this.audioPlay();
    }
  }

  static async loadPage(round, difficulty) {
    let level = +difficulty;
    let page = +round;
    if (page > book[level].length / 10) {
      page = 1;
      level += 1;
    }
    GamePage.refreshPageDropList(book[level].length / 10);
    await this.updateSettings({ page, level });
    clearGameField();
    GamePage.renderResultBlock();
    const pageDropList = document.querySelector('.page__droplist');
    const levelDropList = document.querySelector('.level__droplist');
    pageDropList.value = `${page}`;
    levelDropList.value = `${level}`;
    this.firstWord = Sentence.getWordData(level, page, 1);
    this.word = this.firstWord;
    this.audio = Sentence.loadSentencePronounce(this.word.audio);
    document.querySelector('.puzzle-row').classList.add('puzzle-row_active');
    this.sentence = Sentence.render(this.word.textExample, level, page, 1);
    this.resetButtons();
  }

  static async getSettings() {
    const settings = await API_USER.getUserSettings({ userId: localStorage.getItem('userId') });
    console.log(settings.englishPuzzle)
    store.user.englishPuzzle = settings.englishPuzzle;
    const { page, level, autoplay, translation, audio, background, useLearnedWords } = store.user.englishPuzzle;
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
    const checkbox = document.querySelector('#customSwitch');
    checkbox.checked = useLearnedWords;
    return { page, level, useLearnedWords };
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
    const checkbox = document.querySelector('#customSwitch');
    const pageDropList = document.querySelector('.page__droplist');
    const levelDropList = document.querySelector('.level__droplist');
    puzzles.forEach((puzzle) => {
      fragment.append(puzzle);
      checkbox.checked ?
      Puzzle.showPicture(puzzle, puzzle.dataset.position, rowIndex - 1, this.firstWord.group, this.firstWord.page, 'green'):
      Puzzle.showPicture(puzzle, puzzle.dataset.position, rowIndex - 1, +levelDropList.value - 1, +pageDropList.value - 1, 'green');
    });
    row.append(fragment);
    this.checkAutoPlay();
    const level = checkbox.checked ? this.word.group: +levelDropList.value;
    const page = checkbox.checked ? this.word.page: +pageDropList.value;
    Sentence.translateSentence(level, page, rowIndex);
    const playBtn = document.querySelector('.prompt__button');
    playBtn.addEventListener('click', this.audioPlay);
    const checkBtn = document.querySelector('.puzzle-btn_check');
    checkBtn.classList.add('btn_hidden');
    const answerBtn = document.querySelector('.puzzle-btn_help');
    answerBtn.classList.add('btn_hidden');
    const continueBtn = document.querySelector('.puzzle-btn_continue');
    continueBtn.classList.remove('btn_hidden');
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
    const checkbox = document.querySelector('#customSwitch');
    const pageDropList = document.querySelector('.page__droplist');
    const levelDropList = document.querySelector('.level__droplist');
    let level = checkbox.checked ? this.firstWord.group: +levelDropList.value;
    let page = checkbox.checked ? this.firstWord.page: +pageDropList.value;
    const rowIndex = findCurrentRow();
    if (rowIndex === 10) {
      // this.setStatistic();
      this.showPictureData(level, page);
      if (!checkbox.checked) {
        page = +pageDropList.value;
        level = +levelDropList.value;
        if (page === book[level].length / 10) {
          level === 6 ? level = 1: level += 1;
          page = 1;
          await this.updateSettings({ page, level });
        } else {
          page += 1;
          await this.updateSettings({ page });
        }
      }      
      const answerBtn = document.querySelector('.puzzle-btn_help');
      answerBtn.classList.add('btn_hidden');
      const resultsBtn = document.querySelector('.puzzle-btn_results');
      resultsBtn.classList.remove('btn_hidden');
      const continueBtn = document.querySelector('.puzzle-btn_continue');
      continueBtn.classList.remove('btn_hidden');
    } else {
      const count = document.querySelector('.count');
      const numbers = count.querySelectorAll('.count__number');
      numbers.forEach((number) => {
        number.classList.remove('count__number_active');
      });
      createElement('div', count, ['count__number', 'count__number_active'],
          `${Number(rowIndex) + 1}`);
      if (checkbox.checked) {
        this.word = await WordService.getWordsForGames(1, '"wordsPerExampleSentence":{"$lte": 10}');
        this.audio = Sentence.loadSentencePronounce(this.word.audioExample);
        this.sentence = Sentence.render(this.word.textExample,
          this.word.group, this.word.page, rowIndex + 1);
      } else {
        this.word = Sentence.getWordData(level, page, rowIndex + 1);
        this.audio = Sentence.loadSentencePronounce(this.word.audio);
        this.sentence = Sentence.render(this.word.textExample,
          level, page, rowIndex + 1);
      }
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
    continueBtn.classList.add('btn_hidden');
    resultsBtn.classList.add('btn_hidden');
    checkBtn.classList.add('btn_hidden');
    answerBtn.classList.remove('btn_hidden');
    playBtn.classList.remove('btn_hidden');
  }

  static showPictureData(level, page) {
    const count = document.querySelector('.count');
    count.innerHTML = '';
    const container =
        document.querySelector('.result');
    container.innerHTML = '';
    const playBtn = document.querySelector('.prompt__button');
    playBtn.classList.add('btn_hidden');
    const picture = paintings[level + 1][page];
    const img = new Image(container.offsetWidth, container.offsetHeight);
    const src = picture.cutSrc;
    img.src = `https://raw.githubusercontent.com/Anna234365/rslang_data_paintings/master/${src}`;
    container.append(img);
    const pictureDescription =
    `${picture.author} - ${picture.name} (${picture.year})`;
    const data = document.querySelector('.data');
    createElement('p', data, ['picture-description', 'text-center', 'text-dark'], pictureDescription);
  }

  static audioPlay = () => this.audio.play();

  static handleCheckbox() {
    const checkbox = document.querySelector('#customSwitch');
    checkbox.addEventListener('change', async() => {
      clearGameField();
      GamePage.renderResultBlock();
      await this.updateSettings({ "useLearnedWords": checkbox.checked });
      if (checkbox.checked) {        
        await this.disableDropLists();
      } else {
        const settings = await API_USER.getUserSettings({ userId: localStorage.getItem('userId') });
        const { page, level } = settings.englishPuzzle;
        const pageDropList = document.querySelector('.page__droplist');
        pageDropList.disabled = false;
        pageDropList.value = page;
        const levelDropList = document.querySelector('.level__droplist');
        levelDropList.disabled = false;
        levelDropList.value = level;
        await this.loadPage(page, level);
      }
    });
  }
  
  static async disableDropLists() {
    const data = await WordService.getWordsForGames(1, '"wordsPerExampleSentence":{"$lte": 10}');
    if (typeof data === 'string') {
      console.log('не хватает изученных слов')
      return;
    }
    const pageDropList = document.querySelector('.page__droplist');
    pageDropList.selectedIndex = -1;
    pageDropList.disabled = true;
    const levelDropList = document.querySelector('.level__droplist');
    levelDropList.selectedIndex = -1;
    levelDropList.disabled = true;
    this.firstWord = data;
    this.word = this.firstWord;
    this.audio = Sentence.loadSentencePronounce(this.word.audioExample);
    this.sentence = Sentence.render(this.word.textExample, this.word.group + 1, this.word.page + 1, 1);
  }
}

function findCurrentRow() {
  const count = document.querySelector('.count');
  let rowIndex = 1;
  if (count.lastChild) {
    rowIndex = Number(count.lastChild.textContent);
  }
  return rowIndex;
}

function clearGameField() {
  const container =
    document.querySelector('.result-container');
  if (!container) return;
  container.innerHTML = '';
  const data = document.querySelector('.data');
  if (!data) return;
  data.innerHTML = '';
}