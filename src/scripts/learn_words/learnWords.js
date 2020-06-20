import { createElement } from '../helpers/createElement';
import { initializeSwiper } from './swiper';

export class LearnWords {
  static render() {
    const MAIN = document.querySelector('#main');
    const fragment = document.createDocumentFragment();
    const swiperContainer = createElement('div', fragment, ['swiper-container']);
    ['swiper-wrapper', 'swiper-button-prev', 'swiper-button-next'].forEach((className) => {
      createElement('div', swiperContainer, [className]);
    });     
    MAIN.append(fragment);
    const mySwiper = initializeSwiper('.swiper-container');
    mySwiper.appendSlide('<div class="swiper-slide">Slide 1</div>')
    mySwiper.appendSlide('<div class="swiper-slide">Slide 2</div>')
  }
}