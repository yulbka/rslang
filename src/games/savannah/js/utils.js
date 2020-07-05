const activeItem = (currentItem, items) => {
  Array.from(items).forEach((item) => item.classList.remove('item--active'));
  currentItem.classList.add('item--active');
};

const randomize = (max) => Math.floor(Math.random() * max);

export { randomize, activeItem };
