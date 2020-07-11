import { Puzzle } from './Puzzle';
import { Game } from './Game';
import { book1 } from './data/book1';
import { book2 } from './data/book2';
import { book3 } from './data/book3';
import { book4 } from './data/book4';
import { book5 } from './data/book5';
import { book6 } from './data/book6';

export const book = {
  1: book1,
  2: book2,
  3: book3,
  4: book4,
  5: book5,
  6: book6
};

export class Sentence {
  static getWordData(level, page, round) {
    const word = book[level][(page - 1) * 10 + round - 1];
    return word;
  }

  static render(text, level, page, round) {
    let sentence = text;
    if (text.indexOf('<b>') !== -1) {
      sentence = text.slice(0, text.indexOf('<b>')) +
      text.slice(text.indexOf('<b>') + 3, text.indexOf('</b>')) + text.slice(text.indexOf('</b>') + 4);
    }
    const sentenceLength = sentence.split(' ').join('').length;
    const wordsArray = sentence.split(' ');
    const data = document.querySelector('.data');
    if (!data) return;
    const letterWidth =
    Math.floor((data.offsetWidth - 20 * wordsArray.length) / sentenceLength);
    let puzzlesWidth = 0;
    let position = 0;
    wordsArray.forEach((word, index) => {
      let width = word.length * letterWidth + 40;
      puzzlesWidth += width;
      position = puzzlesWidth - width - 20 * index;
      let type = '';
      if (index === 0) {
        type = 'first';
      } else if (index === wordsArray.length - 1) {
        type = 'last';
        width -= puzzlesWidth - (data.offsetWidth + 20 * index) + 1;
      } else {
        type = 'middle';
      }
      new Puzzle(width, type, word, position).render();
    });
    this.shuffleWords();
    const puzzles = document.querySelectorAll('.new');
    this.checkActivePrompts(puzzles, level, page, round);
    return wordsArray;
  }

  static shuffleWords() {
    const data = document.querySelector('.data');
    let puzzles = document.querySelectorAll('.new');
    puzzles = Array.from(puzzles).sort(() => Math.random() - 0.5);
    data.innerHTML = '';
    puzzles.forEach((puzzle) => data.append(puzzle));
  }

  static loadSentencePronounce(src) {
    const audioSrc = `https://raw.githubusercontent.com/yulbka/rslang-data/master/${src}`;
    const audio = new Audio(audioSrc);
    const audioIcon = document.querySelector('.prompt__button');
    audio.addEventListener('playing', () => {
      audioIcon.classList.add('prompt__button_active');
    });
    audio.addEventListener('ended', () => {
      audioIcon.classList.remove('prompt__button_active');
    });
    return audio;
  }

  static checkActivePrompts(words, level, page, round) {
    this.checkPicturePrompt(words, level, page, round);
    this.checkTranslate(level, page, round);
  }

  static checkPicturePrompt(words, level, page, round) {
    const picturePrompt = document.querySelector('.picture');
    if (picturePrompt.classList.contains('prompt-btn_active')) {
      words.forEach((puzzle) => {
        Puzzle.showPicture(puzzle, puzzle.dataset.position,
            round - 1, level - 1, page - 1);
      });
    }
  }

  static checkTranslate(level, page, round) {
    if (document.querySelector('.text').classList.contains('prompt-btn_active')) {
      this.translateSentence(level, page, round);
    }
  }

  static translateSentence(level, page, round) {
    console.log(level, page, round)
    const prompt = document.querySelector('.prompt__text');
    const checkbox = document.querySelector('#customSwitch');
    if (!checkbox.checked) {
      prompt.textContent = book[level][(page - 1) * 10 + round - 1].textTranslate;
    } else {
      prompt.textContent = Game.word.textExampleTranslate;
    }
  }
}