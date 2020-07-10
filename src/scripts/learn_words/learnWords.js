import tippy from 'tippy.js';
import { PRELOADER } from '../helpers/variables';
import { createElement } from '../helpers/createElement';
import { initializeSwiper } from './swiper';
import { WordService } from '../service/Word.Service';
import { Card } from './Card';
import { setWordDayRepeat } from '../helpers/setWordDayRepeat';
import { store } from '../../store';
import { getRandomNumber } from '../helpers/getRandomNumber';

export class LearnWords {
  static async render() {
    PRELOADER.classList.remove('preload-wrapper-hidden');
    const MAIN = document.querySelector('#main');
    const fragment = document.createDocumentFragment();
    const wrapper = createElement('div', fragment, ['learn-wrapper']);
    const main = createElement('div', wrapper, ['learn-main']);
    const swiperContainer = createElement('div', main, ['swiper-container']);
    createElement('div', swiperContainer, ['swiper-wrapper']);
    ['swiper-button-prev', 'swiper-button-next'].forEach((className) => {
      createElement('div', main, [className]);
    });
    const footer = createElement('footer', wrapper, ['learn-footer']);
    const progressWrapper = createElement('div', footer, ['progress-wrapper']);
    createElement('div', progressWrapper, ['progress-number', 'progress-value', 'text-primary'], '0');
    const progress = createElement('div', progressWrapper, ['progress']);
    createElement('div', progress, ['progress-bar'], '', 'role', 'progressbar');
    createElement('div', progressWrapper, ['progress-number', 'progress-max', 'text-primary'], '100');
    MAIN.append(fragment);
    await this.addCards();
    tippy('[data-tippy-content]');
    this.inputHandler();
    this.showAnswerHandler();
    this.deleteButtonHandler();
    this.hardButtonHandler();
    this.ratingHandler();
    PRELOADER.classList.add('preload-wrapper-hidden');
    const input = document.querySelector('.card-input');
    input.focus();
  }

  static async addCards() {
    const mySwiper = initializeSwiper('.swiper-container');
    const { wordsPerDay, cardsPerDay, learnNewWords, learnOldWords } = store.user.learning;
    const numToRepeat = cardsPerDay - wordsPerDay;
    if (learnNewWords && learnOldWords) {
      await this.addNewWordsToSlider(mySwiper, wordsPerDay);
      await this.addWordsToRepeatToSlider(mySwiper, numToRepeat, wordsPerDay);
    } else if (learnNewWords) {
      await this.addNewWordsToSlider(mySwiper, wordsPerDay);
    } else {
      await this.addWordsToRepeatToSlider(mySwiper, numToRepeat, numToRepeat);
    }
    const progressMax = document.querySelector('.progress-max');
    progressMax.textContent = mySwiper.slides.length;
    const progressBar = document.querySelector('.progress-bar');
    progressBar.setAttribute('aria-valuemax', `${mySwiper.slides.length}`);
  }

  static async addNewWordsToSlider(slider, wordsNumber) {
    const words = await WordService.getNewWords(wordsNumber);
    words.forEach((word) => {
      const card = new Card(word, store.user.learning).render();
      slider.appendSlide(card);
    });
  }

  static async addWordsToRepeatToSlider(slider, wordsNumber, slidesNumber) {
    const userWords = await WordService.getAllUserWords();
    const filteredWords = userWords
      .filter((word) => word.optional.category !== 'deleted')
      .filter((word) => {
        return new Date() - new Date(word.optional.nextDayRepeat) > 0;
      });
    store.user.wordsToRepeat = [];
    await Promise.all(filteredWords.map((word) => WordService.getAggregatedWord(word.wordId))).then((results) =>
      results.forEach((word) => store.user.wordsToRepeat.push(word))
    );
    store.user.wordsToRepeat.slice(0, wordsNumber).forEach((word) => {
      const slideIndex = getRandomNumber(slidesNumber);
      const card = new Card(word, store.user.learning).render();
      slider.addSlide(slideIndex, card);
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
        this.goToNextCard();
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
      const activeSlide = document.querySelector('.swiper-slide-active');
      const input = activeSlide.querySelector('.card-input');
      if (input.hasAttribute('readonly')) return;
      this.showAnswer();
      await this.playAudio();
      this.goToNextCard();
    });
  }

  static async checkAnswer() {
    const activeSlide = document.querySelector('.swiper-slide-active');
    const input = activeSlide.querySelector('.card-input');
    const letters = activeSlide.querySelectorAll('.letter-hidden');
    if (store.user.learning.autoTranslate) {
      this.showTranslate();
    }
    if (input.value.toLowerCase() === input.dataset.word.toLowerCase()) {
      this.showAnswer();
      const wordContainer = activeSlide.querySelector('.word-container');
      wordContainer.classList.add('text-success');
      await this.playAudio();
      const ratingBtns = activeSlide.querySelectorAll('.btn-rating');
      ratingBtns.forEach((btn) => btn.classList.remove('btn-hidden'));
      if (!store.user.learning.wordRating) {
        if (!store.user.learning.autoplay && store.user.learning.autoTranslate) {
          setTimeout(() => this.goToNextCard(), 2000);
        } else {
          this.goToNextCard();
        }
      }
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
    const mySwiper = document.querySelector('.swiper-container').swiper;
    const activeSlide = document.querySelector('.swiper-slide-active');
    const input = activeSlide.querySelector('.card-input');
    input.value = '';
    const letters = activeSlide.querySelectorAll('.letter-hidden');
    letters.forEach((letter) => letter.classList.remove('letter-hidden'));
    input.setAttribute('readonly', '');
    let progressCount;
    if (input.dataset.repeat === 'new') {
      if (input.dataset.mistake) {
        WordService.createUserWord(
          input.dataset.wordId,
          input.dataset.word,
          'weak',
          'learned',
          setWordDayRepeat(),
          setWordDayRepeat('weak', true),
          '1',
          '0'
        );
      } else {
        WordService.createUserWord(
          input.dataset.wordId,
          input.dataset.word,
          'normal',
          'learned',
          setWordDayRepeat(),
          setWordDayRepeat('normal'),
          '0',
          '1'
        );
      }
    }
    if (input.dataset.repeat === 'repeated') {
      const word = await WordService.getAggregatedWord(input.dataset.wordId);
      const { optional } = word.userWord;
      if (input.dataset.mistake) {
        const mistakeCount = +optional.mistakeCount + 1;
        progressCount = +optional.progressCount - 1;
        if (progressCount < 0) progressCount = 0;
        WordService.updateUserWord(input.dataset.wordId, 'weak', {
          lastDayRepeat: setWordDayRepeat(),
          nextDayRepeat: setWordDayRepeat('weak', true),
          mistakeCount,
          progressCount,
        });
      } else {
        progressCount = +optional.progressCount + 1;
        const mistakeCount = +optional.mistakeCount;
        WordService.updateUserWord(input.dataset.wordId, 'normal', {
          lastDayRepeat: setWordDayRepeat(),
          nextDayRepeat: setWordDayRepeat('normal', false, progressCount),
          mistakeCount,
          progressCount,
        });
        if (!store.user.learning.wordRating) {
          this.showProgress();
        }
      }
    }
    if (input.dataset.mistake && !store.user.learning.wordRating) {
      const wordToRepeat = await WordService.getAggregatedWord(input.dataset.wordId);
      const slideIndex = getRandomNumber(mySwiper.slides.length, mySwiper.activeIndex);
      const card = new Card(wordToRepeat, store.user.learning).render();
      mySwiper.addSlide(slideIndex, card);
    }
  }

  static async goToNextCard() {
    const mySwiper = document.querySelector('.swiper-container').swiper;
    mySwiper.allowSlideNext = true;
    mySwiper.slideNext();
    mySwiper.allowSlideNext = false;
  }

  static async playAudio() {
    const { autoplay } = store.user.learning;
    if (!autoplay) return;
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
        WordService.createUserWord(input.dataset.wordId, input.dataset.word, 'normal', 'deleted', setWordDayRepeat(), setWordDayRepeat());
      } else {
        WordService.updateUserWord(input.dataset.wordId, 'normal', { category: 'deleted' });
      }
      mySwiper.removeSlide(mySwiper.activeIndex);
      const progressBar = document.querySelector('.progress-bar');
      progressBar.setAttribute('aria-valuemax', `${mySwiper.slides.length}`);
      const progressMax = document.querySelector('.progress-max');
      progressMax.textContent = mySwiper.slides.length;
    });
  }

  static hardButtonHandler() {
    const learnPage = document.querySelector('.learn-wrapper');
    learnPage.addEventListener('click', async (event) => {
      const activeSlide = document.querySelector('.swiper-slide-active');
      const input = activeSlide.querySelector('.card-input');
      const target = event.target.closest('.btn-difficulty');
      if (!target) return;
      if (input.dataset.repeat === 'new') {
        WordService.createUserWord(
          input.dataset.wordId,
          input.dataset.word,
          'hard',
          'difficult',
          setWordDayRepeat(),
          setWordDayRepeat()
        );
        input.dataset.repeat = 'repeated';
      } else {
        WordService.updateUserWord(input.dataset.wordId, 'hard', { category: 'difficult' });
      }
    });
  }

  static ratingHandler() {
    if (!store.user.learning.wordRating) return;
    const learnPage = document.querySelector('.learn-wrapper');
    learnPage.addEventListener('click', async (event) => {
      const mySwiper = document.querySelector('.swiper-container').swiper;
      const activeSlide = document.querySelector('.swiper-slide-active');
      const input = activeSlide.querySelector('.card-input');
      const target = event.target.closest('.btn-rating');
      if (!target) return;
      const isMistake = input.dataset.mistake === 'mistake';
      const word = await WordService.getAggregatedWord(input.dataset.wordId);
      WordService.updateUserWord(input.dataset.wordId, target.dataset.rating, {
        nextDayRepeat: setWordDayRepeat(target.dataset.rating, isMistake, word.userWord.optional.progressCount),
      });
      if (target.dataset.rating === 'weak' || isMistake) {
        const slideIndex = getRandomNumber(mySwiper.slides.length, mySwiper.activeIndex);
        const card = new Card(word, store.user.learning).render();
        mySwiper.addSlide(slideIndex, card);
      } else {
        this.showProgress();
      }
      this.goToNextCard();
    });
  }

  static showProgress() {
    const progressNumElement = document.querySelector('.progress-number');
    const progressNum = +progressNumElement.textContent + 1;
    progressNumElement.textContent = progressNum;
    const progressBar = document.querySelector('.progress-bar');
    progressBar.setAttribute('aria-valuenow', `${progressNum}`);
    progressBar.style.width = `${Math.round((progressNum / +progressBar.getAttribute('aria-valuemax')) * 100)}%`;
  }
}
