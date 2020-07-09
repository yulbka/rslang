const activeItem = (currentItem, items) => {
  Array.from(items).forEach((item) => item.classList.remove('item--active'));
  currentItem.classList.add('item--active');
};

const randomize = (max) => Math.floor(Math.random() * max);

const arrayRandElement = (arr) => {
  const rand = Math.floor(Math.random() * arr.length);
  return arr[rand];
};

export { randomize, activeItem, arrayRandElement };
