const builtHtml = ({ tagName, classList = [], attrs = {} }) => {
  const newElement = document.createElement(tagName);
  newElement.classList.add(...classList);
  Object.keys(attrs).forEach((key) => newElement.setAttribute(key, attrs[key]));
  return newElement;
};

const makeWord = (info) => {
  const word = builtHtml({
    tagName: 'div',
    classList: ['item'],
    attrs: {
      'data-image-src': info.image.slice(6),
      'data-audio-src': info.audio.slice(6),
      'data-word': info.word,
    },
  });
  word.innerHTML = `
      <img class="item__icon" src="https://cdn.onlinewebfonts.com/svg/img_314105.png" alt="">
      <p class="item__word">${info.word}</p>
      <p class="item__transcription">${info.transcription}</p>
  `;
  return word;
};

export { builtHtml, makeWord };
