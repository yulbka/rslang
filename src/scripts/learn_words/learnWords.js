import { createElement } from '../helpers/createElement';
import { initializeSwiper } from './swiper';
import { WordService } from '../service/Word.Service';
import { Card } from './Card';

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
    const mySwiper = initializeSwiper('.swiper-container');
    const words = await WordService.getWords();
    console.log(words);
    words[0].forEach((word) => {
      const card = new Card(word, true, true, true, true, true, true, true, true).render();
      mySwiper.appendSlide(card);
    });
    this.inputHandler();
  }

  static inputHandler() {
    document.body.addEventListener('change', (event) => {
      const target = event.target.closest('.card-input');
      if (!target) return;
      const mySwiper = document.querySelector('.swiper-container').swiper;
      const activeSlide = document.querySelector('.swiper-slide-active');
      const letters = activeSlide.querySelectorAll('.letter-hidden');
      if (target.value.toLowerCase() === target.dataset.word.toLowerCase()) {
        mySwiper.allowSlideNext = true;
        mySwiper.slideNext();
        mySwiper.allowSlideNext = false;
      } else {
        this.hightLightAnswer(target, letters);
      }
      target.value = '';
      target.addEventListener('input', () => {
        letters.forEach((letter) => {
          letter.classList.remove('text-success', 'text-warning', 'text-danger', 'letter-transparent');
          letter.classList.add('letter-hidden');
        });
      });
    });
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
}
