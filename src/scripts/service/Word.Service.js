import { requestCreator } from '../../utils/requests';

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
    this.words = [];
    this.words.push(
      await requestCreator({
        url: `/words?page=${page}&group=${level}`,
        method: requestCreator.methods.get,
      })
    );
    return this.words;
  }

  static async getMoreWords() {
    this.page += 1;
    let newWords = await requestCreator({
      url: `/words?page=${this.page}&group=${this.level}`,
      method: requestCreator.methods.get,
    });
    if (!newWords.length) {
      this.level += 1;
      this.page = 0;
      newWords = await requestCreator({
        url: `/words?page=${this.page}&group=${this.level}`,
        method: requestCreator.methods.get,
      });
      if (!newWords.length) {
        this.level = 0;
        this.page = 0;
        newWords = await requestCreator({
          url: `/words?page=${this.page}&group=${this.level}`,
          method: requestCreator.methods.get,
        });
      }
    }
    this.words.push(newWords);
    return newWords;
  }

  static async getAllUserWords() {
    const words = await requestCreator({
      url: `/users/${localStorage.getItem('userId')}/words`,
      method: requestCreator.methods.get,
    });
    console.log(words);
    return words;
  }

  static async getUserWord(wordId) {
    const word = await requestCreator({
      url: `/users/${localStorage.getItem('userId')}/words${wordId}`,
      method: requestCreator.methods.get,
    });
    console.log(word);
    return word;
  }

  static async createUserWord(wordId, difficulty, category, nextDayRepeat, mistakeCount, progressCount) {
    const word = {
      "difficulty": difficulty, // weak, hard, normal, easy
      "optional": {
        "category": category, // learned, deleted, difficult
        "nextDayRepeat": nextDayRepeat,
        "mistakeCount": mistakeCount,
        "progressCount": progressCount // if mistake -1, if correct +1, >= 0
      }
    }
    const result = await requestCreator({
      url: `/users/${localStorage.getItem('userId')}/words${wordId}`,
      method: requestCreator.methods.post,
      data: word
    });
    console.log(result);
  }

  static async updateUserWord(wordId, difficulty, updatedFields) {
    const word = await this.getUserWord(wordId);
    const { optional } = word;
    const result = await requestCreator({
      url: `/users/${localStorage.getItem('userId')}/words${wordId}`,
      method: requestCreator.methods.put,
      data: { 
        "difficulty": difficulty,
        "optional": {
          ...updatedFields,
          ...optional,
        }    
      }
    });
    console.log(result);
  }
}
