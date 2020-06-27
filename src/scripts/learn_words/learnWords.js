import tippy from 'tippy.js';
import { createElement } from '../helpers/createElement';
import { initializeSwiper } from './swiper';
import { WordService } from '../service/Word.Service';
import { Card } from './Card';
import { setWordNextDayRepeat } from '../helpers/setWordNextDayRepeat';
import { store } from '../../store';
import { getRandomNumber } from '../helpers/getRandomNumber';

export class LearnWords {
  static async render() {
    const MAIN = document.querySelector('#main');
    const fragment = document.createDocumentFragment();
    const wrapper = createElement('div', fragment, ['learn-wrapper']);
    const swiperContainer = createElement('div', wrapper, ['swiper-container']);
    createElement('div', swiperContainer, ['swiper-wrapper']);
    ['swiper-button-prev', 'swiper-button-next'].forEach((className) => {
      createElement('div', wrapper, [className]);
    });
    MAIN.append(fragment);
    await WordService.getAllUserWords();
    await WordService.getWordsByCategory('deleted');
    await this.addCards();
    tippy('[data-tippy-content]');
    this.inputHandler();
    this.showAnswerHandler();
    this.deleteButtonHandler();
    this.difficultyButtonHandler();
  }

  static async addCards() {
    const mySwiper = initializeSwiper('.swiper-container');
    const {
      wordsPerDay,
      newWordsPerDay,
      withTranslation,
      withExplanation,
      withExample,
      withTranscription,
      withHelpImage,
      showAnswerButton,
      showDeleteButton,
      showHardButton,
    } = store.user.learning;
    const numToRepeat = wordsPerDay - newWordsPerDay;
    const words = await WordService.getNewWords(newWordsPerDay);
    words.forEach((word) => {
      const card = new Card(
        word,
        withTranslation,
        withExplanation,
        withExample,
        withTranscription,
        withHelpImage,
        showAnswerButton,
        showDeleteButton,
        showHardButton
      ).render();
      mySwiper.appendSlide(card);
    });
    store.user.wordsToRepeat.slice(0, numToRepeat).forEach((word) => {
      const slideIndex = getRandomNumber(newWordsPerDay);
      const card = new Card(
        word,
        withTranslation,
        withExplanation,
        withExample,
        withTranscription,
        withHelpImage,
        showAnswerButton,
        true,
        true
      ).render();
      mySwiper.addSlide(slideIndex, card);
    });
  }

  static inputHandler() {
    const learnPage = document.querySelector('.learn-wrapper');
    learnPage.addEventListener('keydown', (event) => {
      const target = event.target.closest('.card-input');
      if (!target) return;
      if (event.keyCode === 13) {
        this.checkAnswer();
      }
    });
    learnPage.addEventListener('click', (event) => {
      const target = event.target.closest('.swiper-button-next');
      if (!target) return;
      const mySwiper = document.querySelector('.swiper-container').swiper;
      const activeSlide = document.querySelector('.swiper-slide-active');
      const input = activeSlide.querySelector('.card-input');
      if (input.hasAttribute('readonly')) {
        mySwiper.allowSlideNext = true;
      } else {
        mySwiper.allowSlideNext = false;
        this.checkAnswer();
      }
    });
  }

  static showAnswerHandler() {
    const learnPage = document.querySelector('.learn-wrapper');
    learnPage.addEventListener('click', async (event) => {
      const target = event.target.closest('.show-answer');
      if (!target) return;
      this.showAnswer();
      await this.playAudio();
      this.goToNextCard();
    });
  }

  static async checkAnswer() {
    const activeSlide = document.querySelector('.swiper-slide-active');
    const input = activeSlide.querySelector('.card-input');
    const letters = activeSlide.querySelectorAll('.letter-hidden');
    this.showTranslate();
    if (input.value.toLowerCase() === input.dataset.word.toLowerCase()) {
      this.showAnswer();
      await this.playAudio();
      this.goToNextCard();
    } else {
      input.dataset.mistake = 'mistake';
      this.hightLightAnswer(input, letters);
      this.playAudio();
      input.addEventListener('input', () => {
        letters.forEach((letter) => {
          letter.classList.remove('text-success', 'text-warning', 'text-danger', 'letter-transparent');
          letter.classList.add('letter-hidden');
        });
      });
    }
    input.value = '';
  }

  static hightLightAnswer(input, letters) {
    const activeSlide = document.querySelector('.swiper-slide-active');
    letters.forEach((letter, index) => {
      letter.classList.remove('letter-hidden');
      if (input.value[index] && letter.textContent.toLowerCase() === input.value[index].toLowerCase()) {
        letter.classList.add('text-success');
      } else {
        letter.classList.add('text-warning');
      }
    });
    const wrongs = activeSlide.querySelectorAll('.text-warning');
    if (wrongs.length > 2) {
      wrongs.forEach((letter) => {
        letter.classList.add('text-danger');
      });
    }
    letters.forEach((letter) => {
      letter.classList.add('letter-transparent');
    });
  }

  static async showAnswer() {
    const activeSlide = document.querySelector('.swiper-slide-active');
    const input = activeSlide.querySelector('.card-input');
    const letters = activeSlide.querySelectorAll('.letter-hidden');
    letters.forEach((letter) => letter.classList.remove('letter-hidden'));
    input.setAttribute('readonly', '');
    if (input.dataset.repeat === 'new') {
      if (input.dataset.mistake) {
        WordService.createUserWord(
          input.dataset.wordId,
          input.dataset.word,
          'weak',
          'learned',
          setWordNextDayRepeat('weak', true),
          '1',
          '0'
        );
      } else {
        WordService.createUserWord(
          input.dataset.wordId,
          input.dataset.word,
          'normal',
          'learned',
          setWordNextDayRepeat('normal'),
          '0',
          '1'
        );
      }
    } else {
      const word = await WordService.getUserWord(input.dataset.wordId);
      const { optional } = word;
      if (input.dataset.mistake) {
        const mistakeCount = +optional.mistakeCount + 1;
        let progressCount = +optional.progressCount - 1;
        if (progressCount < 0) progressCount = 0;
        WordService.updateUserWord(input.dataset.currentWord.id, 'weak', {
          nextDayRepeat: setWordNextDayRepeat('weak', true),
          mistakeCount,
          progressCount,
        });
      } else {
        const progressCount = +optional.progressCount + 1;
        const mistakeCount = +optional.mistakeCount;
        WordService.updateUserWord(input.dataset.wordId, 'normal', {
          nextDayRepeat: setWordNextDayRepeat('normal', false, progressCount),
          mistakeCount,
          progressCount,
        });
      }
    }
  }

  static async goToNextCard() {
    const mySwiper = document.querySelector('.swiper-container').swiper;
    mySwiper.allowSlideNext = true;
    mySwiper.slideNext();
    mySwiper.allowSlideNext = false;
  }

  static async playAudio() {
    const activeSlide = document.querySelector('.swiper-slide-active');
    const playList = activeSlide.querySelectorAll('audio');
    return new Promise((resolve) => {
      playList.forEach((sound, index) => {
        const audio = sound;
        const input = activeSlide.querySelector('.card-input');
        input.addEventListener('input', () => {
          audio.pause();
          audio.currentTime = 0;
        });
        if (index === 0) {
          audio.play();
        } else {
          playList[index - 1].addEventListener('ended', () => {
            audio.play();
          });
        }
        playList[playList.length - 1].addEventListener('ended', () => {
          resolve();
        });
      });
    });
  }

  static showTranslate() {
    const activeSlide = document.querySelector('.swiper-slide-active');
    const translates = activeSlide.querySelectorAll('.card-translate');
    translates.forEach((translate) => {
      translate.classList.remove('card-translate-hidden');
    });
  }

  static deleteButtonHandler() {
    const learnPage = document.querySelector('.learn-wrapper');
    learnPage.addEventListener('click', async (event) => {
      const activeSlide = document.querySelector('.swiper-slide-active');
      const mySwiper = document.querySelector('.swiper-container').swiper;
      const input = activeSlide.querySelector('.card-input');
      const target = event.target.closest('.btn-delete');
      if (!target) return;
      if (input.dataset.repeat === 'new') {
        WordService.createUserWord(input.dataset.wordId, input.dataset.word, 'normal', 'deleted', '');
      } else {
        WordService.updateUserWord(input.dataset.wordId, 'normal', { category: 'deleted' });
      }
      mySwiper.removeSlide(mySwiper.activeIndex);
    });
  }

  static difficultyButtonHandler() {
    const learnPage = document.querySelector('.learn-wrapper');
    learnPage.addEventListener('click', async (event) => {
      const activeSlide = document.querySelector('.swiper-slide-active');
      // const mySwiper = document.querySelector('.swiper-container').swiper;
      const input = activeSlide.querySelector('.card-input');
      const target = event.target.closest('.btn-difficulty');
      if (!target) return;
      // tippy(target, {
      //   theme: 'light-border',
      //   trigger: 'click',
      //   content: 'Слово добавлено в словарь',
      // });
      if (input.dataset.repeat === 'new') {
        WordService.createUserWord(
          input.dataset.wordId,
          input.dataset.word,
          'hard',
          'difficult',
          setWordNextDayRepeat()
        );
        input.dataset.repeat = 'repeated';
      } else {
        WordService.updateUserWord(input.dataset.wordId, 'hard', { category: 'difficult' });
      }
    });
  }
}
