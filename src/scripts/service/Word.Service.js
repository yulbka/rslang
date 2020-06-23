import { HttpService } from './HttpClient.Service';

export class WordService {
  constructor() {
    this._words = [];
    this._level = 0;
    this._page = 0;
  }

  get words() {
    return this._words;
  }

  set words(words) {
    this._words = words;
  }

  get level() {
    return this._level;
  }

  set level(level) {
    this._level = level;
  }

  get page() {
    return this._page;
  }

  set page(page) {
    this._page = page;
  }

  static async getWords(level = 0, page = 0) {
    this.level = level;
    this.page = page;
    const url = `https://afternoon-falls-25894.herokuapp.com/words?page=${page}&group=${level}`;
    this.words = [];
    this.words.push(await HttpService.get(url));
    return this.words;
  }

  static async getMoreWords() {
    this.page += 1;
    let newWords = await HttpService.get(
      `https://afternoon-falls-25894.herokuapp.com/words?page=${this.page}&group=${this.level}`
    );
    if (!newWords.length) {
      this.level += 1;
      this.page = 0;
      newWords = await HttpService.get(
        `https://afternoon-falls-25894.herokuapp.com/words?page=${this.page}&group=${this.level}`
      );
      if (!newWords.length) {
        this.level = 0;
        this.page = 0;
        newWords = await HttpService.get(
          `https://afternoon-falls-25894.herokuapp.com/words?page=${this.page}&group=${this.level}`
        );
      }
    }
    this.words.push(newWords);
    return newWords;
  }

}
