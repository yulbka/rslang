import { createElement } from '../helpers/createElement';

export class Card {
  constructor(word, withTranslation, withExplanation, withExample, withTranscription,
     withImage, withAnswer, withDelete, withDifficulty) {
    this.word = word;
    this.withTranslation = withTranslation;
    this.withExplanation = withExplanation;
    this.withExample = withExample;
    this.withTranscription = withTranscription;
    this.withImage = withImage;
    this.withAnswer= withAnswer;
    this.withDelete = withDelete;
    this.withDifficulty = withDifficulty;
  }

  render() {
    const fragment = document.createDocumentFragment();
    const card = createElement('div', fragment, ['card', 'swiper-slide']);
    if (this.withImage) {
      const img = createElement('img', card, ['card-img-top'], 'alt', 'hint');
      img.width = 390;
      img.height = 260;
      img.src = `https://raw.githubusercontent.com/yulbka/rslang-data/master/${this.word.image}`
    }
    const word = createElement('span', document.body, ['card-text'], this.word.word);
    const cardBody = createElement('div', card, ['card-body']);
    const sentence = createElement('p', cardBody, ['card-text']);
    createElement('audio', sentence, ['audio-word'], '', 'src',
       `https://raw.githubusercontent.com/yulbka/rslang-data/master/${this.word.audio}`);
    if (this.withExample) {
      const example = this.word.textExample;      
      createElement('span', sentence, [], example.slice(0, example.indexOf('<b>')));      
      const input = createElement('input', sentence, ['card-input', 'input-group-text'], '', 'type', 'text');
      input.style.width = `${word.offsetWidth}px`;
      createElement('span', sentence, [], example.slice(example.indexOf('</b>') + 4));
      createElement('audio', sentence, ['audio-example'], '', 'src',
       `https://raw.githubusercontent.com/yulbka/rslang-data/master/${this.word.audioExample}`);      
    } else {
      const input = createElement('input', sentence, ['card-input', 'input-group-text'], '', 'type', 'text');
      input.style.width = `${word.offsetWidth}px`;
    }
    createElement('p', sentence, ['card-translate', 'card-translate-hidden'], this.word.wordTranslate);
    const ul = createElement('ul', card, ['list-group', 'list-group-flush']);
    createElement('li', ul, ['list-group-item', 'card-translate', 'card-translate-hidden'], this.word.textExampleTranslate);
    if (this.withTranscription) {
      createElement('li', ul, ['list-group-item'], this.word.transcription);
    }
    if (this.withTranslation) {
      createElement('li', ul, ['list-group-item'], this.word.wordTranslate);
    }
    if (this.withExplanation) {
      const meaning = this.word.textMeaning;
      const delimiter = meaning.indexOf('</i> is ') + '</i> is '.length;
      createElement('li', ul, ['list-group-item'], `${meaning.slice(delimiter, delimiter + 1).toUpperCase()}${meaning.slice(delimiter + 1)}`);
      createElement('audio', sentence, ['audio-meaning'], '', 'src',
       `https://raw.githubusercontent.com/yulbka/rslang-data/master/${this.word.audioMeaning}`);
    }
    createElement('li', ul, ['list-group-item', 'card-translate', 'card-translate-hidden'], this.word.textMeaningTranslate);
    const footer = createElement('div', card, ['card-body']);
    const controls = createElement('div', footer, ['btn-group'], '', 'role', 'group');
    if (this.withAnswer) {
      createElement('button', controls, ['btn', 'btn-light'], 'Показать ответ');
    }
    if (this.withDelete) {
      createElement('button', controls, ['btn', 'btn-light'], 'Удалить');
    }
    if (this.withDifficulty) {
      createElement('button', controls, ['btn', 'btn-light'], 'Сложное слово');
    }
    word.remove();
    return fragment;
  }
}