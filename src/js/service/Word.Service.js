import { HttpService } from './HttpClient.Service';

export class WordService { 
  static async getWords(level, page) {
    const url = `https://afternoon-falls-25894.herokuapp.com/words?page=${page - 1}&group=${level - 1}`;
    const words = await HttpService.get(url);
    return words;
  }
}