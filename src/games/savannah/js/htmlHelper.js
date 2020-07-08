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
      'data-word': info.word,
    },
  });
  word.innerHTML = `
      <p class="item__translation">${info.wordTranslate}</p>
  `;
  return word;
};

const makeMainWord = (info) => {
  const word = builtHtml({
    tagName: 'div',
    classList: ['item'],
    attrs: {
      'data-word': info.word,
    },
  });
  word.innerHTML = `
      <p class="item__word">${info.word}</p>
  `;
  return word;
};

export { builtHtml, makeWord, makeMainWord };
