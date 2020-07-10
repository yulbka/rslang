import { createElement } from '../helpers/createElement';

export class Card {
  constructor(
    word,
    {
      withTranslation,
      withExplanation,
      withExample,
      withTranscription,
      withHelpImage,
      autoplay,
      showAnswerButton,
      deleteWord,
      hardWord,
      wordRating,
    },
  ) {
    this.word = word;
    this.withTranslation = withTranslation;
    this.withExplanation = withExplanation;
    this.withExample = withExample;
    this.withTranscription = withTranscription;
    this.withHelpImage = withHelpImage;
    this.autoplay = autoplay;
    this.showAnswerButton = showAnswerButton;
    this.deleteWord = deleteWord;
    this.hardWord = hardWord;
    this.wordRating = wordRating;
    this.API_HOST = 'https://raw.githubusercontent.com/yulbka/rslang-data/master/';
  }

  render() {
    const fragment = document.createDocumentFragment();
    const card = createElement('div', fragment, ['card', 'swiper-slide']);
    this.renderHelpImage(card);
    const word = createElement('span', document.body, ['card-text'], this.word.word);
    const sentence = this.renderCardBody(card, word);
    const ul = createElement('ul', card, ['list-group', 'list-group-flush']);
    this.renderRatingControls(ul);
    this.addTranslation(ul);
    this.addExample(ul);
    if (this.withTranscription) {
      createElement('li', ul, ['list-group-item'], this.word.transcription);
    }
    this.addExplanation(ul, sentence);
    this.renderFooter(card);
    word.remove();
    return fragment;
  }

  renderHelpImage(card) {
    if (!this.withHelpImage) return;
    createElement('img', card, ['card-img-top'], '', 'src', `${this.API_HOST}${this.word.image}`);
  }

  renderCardBody(card, wordExample) {
    const cardBody = createElement('div', card, ['card-body']);
    const sentence = createElement('p', cardBody, ['card-text']);
    if (this.autoplay) {
      createElement('audio', sentence, ['audio-word'], '', 'src', `${this.API_HOST}${this.word.audio}`);
    }
    if (this.withExample) {
      const example = this.word.textExample;
      createElement('span', sentence, [], example.slice(0, example.indexOf('<b>')));
      this.renderInputContainer(sentence, wordExample);
      createElement('span', sentence, [], example.slice(example.indexOf('</b>') + 4));
      if (this.autoplay) {
        createElement('audio', sentence, ['audio-example'], '', 'src', `${this.API_HOST}${this.word.audioExample}`);
      }
    } else {
      this.renderInputContainer(sentence, wordExample);
    }
    return sentence;
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
      `<input class='card-input input-group-text'
      type='text'
      data-word='${this.word.word}'
      data-word-id='${this.word._id}'
      data-repeat='${repeat}'
      style='width: ${example.offsetWidth}px;'
      >`
    );
  }

  addTranslation(cardElement) {
    const translation = createElement(
      'li',
      cardElement,
      ['list-group-item', 'card-translate', 'card-translate-hidden'],
      this.word.wordTranslate
    );
    if (this.withTranslation) {
      translation.classList.remove('card-translate-hidden');
    }
  }

  addExample(cardElement) {
    if (this.withExample) {
      createElement(
        'li',
        cardElement,
        ['list-group-item', 'card-translate', 'card-translate-hidden'],
        this.word.textExampleTranslate
      );
    }
  }

  addExplanation(cardElement, sentence) {
    if (this.withExplanation) {
      const meaning = this.word.textMeaning;
      const delimiter = meaning.indexOf('</i>') + '</i> '.length;
      createElement(
        'li',
        cardElement,
        ['list-group-item'],
        `${meaning.slice(delimiter, delimiter + 1).toUpperCase()}${meaning.slice(delimiter + 1)}`
      );
      if (this.autoplay) {
        createElement('audio', sentence, ['audio-meaning'], '', 'src', `${this.API_HOST}${this.word.audioMeaning}`);
      }
      createElement(
        'li',
        cardElement,
        ['list-group-item', 'card-translate', 'card-translate-hidden'],
        this.word.textMeaningTranslate
      );
    }
  }

  renderRatingControls(element) {
    if (!this.wordRating) return;
    const ratingControls = createElement('div', element, ['btn-group', 'rating'], '', 'role', 'group');
    [
      { text: 'Снова', data: 'weak' },
      { text: 'Трудно', data: 'hard' },
      { text: 'Хорошо', data: 'normal' },
      { text: 'Легко', data: 'easy' },
    ].forEach((control) => {
      createElement(
        'button',
        ratingControls,
        ['btn', 'btn-light', 'btn-rating', 'btn-hidden'],
        `${control.text}`,
        'data-rating',
        `${control.data}`
      );
    });
  }

  renderFooter(card) {
    if (!this.showAnswerButton && !this.deleteWord && !this.hardWord) return;
    const footer = createElement('div', card, ['card-body']);
    const controls = createElement('div', footer, ['btn-group'], '', 'role', 'group');
    if (this.showAnswerButton) {
      createElement('button', controls, ['btn', 'btn-light', 'show-answer'], 'Показать ответ');
    }
    if (this.deleteWord) {
      createElement('button', controls, ['btn', 'btn-light', 'btn-delete'], 'Удалить');
    }
    if (this.hardWord) {
      controls.insertAdjacentHTML(
        'beforeend',
        `<button class='btn btn-light btn-difficulty'
      data-tippy-content='Слово добавлено в словарь'
      data-tippy-theme='light-border'
      data-tippy-trigger='focus'>
      Сложное слово
      </button>`
      );
    }
  }
}
