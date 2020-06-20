import Swiper from 'swiper';

export function initializeSwiper(container) {
  return new Swiper(container, {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
  });
}