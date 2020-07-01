import { stopRecognition } from './utils';
import { getImages, getTranslations } from './apis';

const speechRecognition = () => {
  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognitionInput = document.querySelector('.word__recognition');

  const recognition = new window.SpeechRecognition();
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.addEventListener('result', (e) => {
    const transcript = Array.from(e.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join('');

    recognitionInput.textContent = transcript;

    const words = document.querySelectorAll('.item__word');
    words.forEach((word) => {
      const text = word.textContent.toLowerCase();
      if (transcript.toLowerCase().includes(text)) {
        word.closest('.item').classList.add('item--right');

        const wordContainer = word.closest('.item');
        const image = wordContainer.getAttribute('data-image-src');
        const wordTranslation = document.querySelector('.word__translation');
        const wordImage = document.querySelector('.word__img');
        const englishWord = wordContainer.getAttribute('data-word');
        stopRecognition();
        getImages(image).then((url) => {
          wordImage.src = url;
          return undefined;
        });
        getTranslations(englishWord).then((data) => {
          wordTranslation.textContent = data.text;
          return undefined;
        });
      }
    });
  });

  recognition.addEventListener('end', () => {
    const restartBtn = document.querySelector('.btn__restart');
    if (restartBtn.classList.contains('restart--active')) {
      recognition.abort();
      restartBtn.classList.remove('restart--active');
      stopRecognition();
    } else {
      recognition.start();
    }
    if (document.getElementsByClassName('item--right').length === 10) {
      stopRecognition();
      document.querySelector('.btn__results').click();
    }
  });

  recognition.start();
};

export default speechRecognition;
