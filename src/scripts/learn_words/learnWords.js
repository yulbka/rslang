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
  }
}