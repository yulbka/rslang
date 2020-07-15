const listiner = (isActive) => {
  const microphone = document.querySelector('.word__recognition');
  microphone.classList.toggle('microphone--active', isActive);
};

const stopTranslation = () => {
  document.querySelector('.word__translation').textContent = '';
};

const stopRecognition = () => {
  document.querySelector('.word__recognition').textContent = '';
};

const activeItem = (currentItem, items) => {
  Array.from(items).forEach((item) => item.classList.remove('item--active'));
  currentItem.classList.add('item--active');
};

const randomize = (max) => Math.floor(Math.random() * max);

const audioPlayer = (url) => new Audio(url).play();

export { randomize, audioPlayer, activeItem, stopTranslation, stopRecognition, listiner };
