import '../css/burger.css';

function toggleBurger() {
  document.querySelector('.burger').classList.toggle('clicked');
  document.querySelector('.overlay').classList.toggle('show');
  document.querySelector('nav').classList.toggle('show');
  document.querySelector('body').classList.toggle('overflow');
}

document.querySelector('.burger, .overlay').addEventListener('click', toggleBurger);
