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
    this.showAnswerHandler();
  }

  static inputHandler() {
    const learnPage = document.querySelector('.learn-wrapper');
    learnPage.addEventListener('keydown', (event) => {
      const target = event.target.closest('.card-input');
      if (!target) return;
      if(event.keyCode === 13) {
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
    if (input.value.toLowerCase() === input.dataset.word.toLowerCase()) {
      this.showAnswer();
      await this.playAudio();
      this.goToNextCard();
    } else {
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

  static showAnswer() {    
    const activeSlide = document.querySelector('.swiper-slide-active');
    const input = activeSlide.querySelector('.card-input');
    const letters = activeSlide.querySelectorAll('.letter-hidden');
    letters.forEach((letter) => letter.classList.remove('letter-hidden'));
    input.setAttribute('readonly', '');
  }

  static goToNextCard() {
    const mySwiper = document.querySelector('.swiper-container').swiper;
    mySwiper.allowSlideNext = true;
    mySwiper.slideNext();
    mySwiper.allowSlideNext = false;
  }

  static async playAudio() {
    const playList = [];
    const activeSlide = document.querySelector('.swiper-slide-active');
    const audioWord = activeSlide.querySelector('.audio-word');
    playList.push(audioWord);
    const audioExample = activeSlide.querySelector('.audio-example');
    if (audioExample) {
      playList.push(audioExample);
    }
    const audioMeaning = activeSlide.querySelector('.audio-meaning');
    if (audioMeaning) {
      playList.push(audioMeaning);
    }
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
    })
    
  }
}
