import Swiper from 'swiper';

export function initializeSwiper(container) {
  return new Swiper(container, {
    allowSlideNext: false,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    on: {
      slideChangeTransitionEnd: () => {
        const slide = document.querySelector('.swiper-slide-active');
        slide.querySelector('.card-input').focus();
      },
    },
  });
}
