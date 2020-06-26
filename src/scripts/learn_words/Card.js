import { createElement } from '../helpers/createElement';

export class Card {
  constructor(
    word,
    withTranslation,
    withExplanation,
    withExample,
    withTranscription,
    withImage,
    withAnswer,
    withDelete,
    withDifficulty
  ) {
    this.word = word;
    this.withTranslation = withTranslation;
    this.withExplanation = withExplanation;
    this.withExample = withExample;
    this.withTranscription = withTranscription;
    this.withImage = withImage;
    this.withAnswer = withAnswer;
    this.withDelete = withDelete;
    this.withDifficulty = withDifficulty;
  }

  render() {
    const API_HOST = 'https://raw.githubusercontent.com/yulbka/rslang-data/master/';
    const fragment = document.createDocumentFragment();
    const card = createElement('div', fragment, ['card', 'swiper-slide']);
    if (this.withImage) {
      createElement('img', card, ['card-img-top'], '', 'src', `${API_HOST}${this.word.image}`);
    }
    const cardBody = createElement('div', card, ['card-body']);
    const sentence = createElement('p', cardBody, ['card-text']);
    const word = createElement('span', document.body, ['card-text'], this.word.word);
    createElement('audio', sentence, ['audio-word'], '', 'src', `${API_HOST}${this.word.audio}`);
    if (this.withExample) {
      const example = this.word.textExample;
      createElement('span', sentence, [], example.slice(0, example.indexOf('<b>')));
      this.renderInputContainer(sentence, word);
      createElement('span', sentence, [], example.slice(example.indexOf('</b>') + 4));
      createElement('audio', sentence, ['audio-example'], '', 'src', `${API_HOST}${this.word.audioExample}`);
    } else {
      this.renderInputContainer(sentence, word);
    }
    const ul = createElement('ul', card, ['list-group', 'list-group-flush']);
    if (this.withExample) {
      createElement(
        'li',
        ul,
        ['list-group-item', 'card-translate', 'card-translate-hidden'],
        this.word.textExampleTranslate
      );
    }    
    if (this.withTranscription) {
      createElement('li', ul, ['list-group-item'], this.word.transcription);
    }
    if (this.withTranslation) {
      createElement('li', ul, ['list-group-item'], this.word.wordTranslate);
    }
    if (this.withExplanation) {
      const meaning = this.word.textMeaning;
      const delimiter = meaning.indexOf('</i> is ') + '</i> is '.length;
      createElement(
        'li',
        ul,
        ['list-group-item'],
        `${meaning.slice(delimiter, delimiter + 1).toUpperCase()}${meaning.slice(delimiter + 1)}`
      );
      createElement('audio', sentence, ['audio-meaning'], '', 'src', `${API_HOST}${this.word.audioMeaning}`);
      createElement(
        'li',
        ul,
        ['list-group-item', 'card-translate', 'card-translate-hidden'],
        this.word.textMeaningTranslate
      );
    }    
    const footer = createElement('div', card, ['card-body']);
    const controls = createElement('div', footer, ['btn-group'], '', 'role', 'group');
    if (this.withAnswer) {
      createElement('button', controls, ['btn', 'btn-light', 'show-answer'], 'Показать ответ');
    }
    if (this.withDelete) {
      createElement('button', controls, ['btn', 'btn-light', 'btn-delete'], 'Удалить');
    }
    if (this.withDifficulty) {
      createElement('button', controls, ['btn', 'btn-light', 'btn-difficulty'], 'Сложное слово');
    }
    word.remove();
    return fragment;
  }

  renderInputContainer(parent, example) {
    const inputContainer = createElement('span', parent, ['input-container']);
    inputContainer.style.width = `${example.offsetWidth}px`;
    const wordContainer = createElement('span', inputContainer, ['word-container']);
    this.word.word.split('').forEach((letter) => {
      createElement('span', wordContainer, ['letter-hidden'], letter);
    });
    let repeat = 'new';
    if (this.word.userWord) repeat = 'repeated';
    inputContainer.insertAdjacentHTML(
      'beforeend',
      `<input class='card-input input-group-text' type='text' data-word='${this.word.word}' data-word-id='${this.word._id}' data-repeat='${repeat}' style='width: ${example.offsetWidth}px;' autofocus>`
    );
    createElement('span', inputContainer, ['card-translate', 'card-translate-hidden', 'word-translate'], this.word.wordTranslate);
  }
}
