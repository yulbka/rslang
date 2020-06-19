import { MAIN } from './constants';
import { createElement } from './helpers/createElement';
import { validatePassword } from './helpers/validatePassword';
import { App } from './App';
import { HttpService } from './service/HttpClient.Service';
export class Authorization {
  static render(type = 'login') {
    const fragment = document.createDocumentFragment();
    const wrapper = createElement('div', fragment, ['authorization__wrapper']);
    const form = createElement('form', wrapper, ['authorization__form']);
    const formGroup1 = createElement('div', form, ['form-group', 'is-invalid']);
    createElement('label', formGroup1, [], 'Email', 'for', 'email');
    const email = createElement('input', formGroup1, ['form-control'], '', 'required', '');
    ['id', 'type'].forEach((attr) => email.setAttribute(`${attr}`, 'email'));
    createElement('div', formGroup1, ['invalid-feedback', 'invalid-feedback-email']);
    const formGroup2 = createElement('div', form, ['form-group']);
    createElement('label', formGroup2, [], 'Пароль', 'for', 'password');
    const password = createElement('input', formGroup2, ['form-control'], '', 'required', '');
    ['id', 'type'].forEach((attr) => password.setAttribute(`${attr}`, 'password'));
    createElement('div', formGroup2, ['invalid-feedback', 'invalid-feedback-password']);
    const submitBtn = createElement('button', form, ['btn', 'btn-primary', 'authorization__submit']);
    const note = createElement('p', wrapper, ['text-muted', 'authorization__text']);
    const linkBtn = createElement('button', wrapper, ['btn', 'btn-outline-secondary', 'btn-sm', 'authorization-link']);
    if (type === 'login') {
      submitBtn.textContent = 'Войти';
      submitBtn.dataset.type = 'signIn';
      note.textContent = 'Впервые на RSLang?';
      linkBtn.textContent = 'Регистрация';
      linkBtn.dataset.type = 'registration';
    } else {
      submitBtn.textContent = 'Зарегистрироваться';
      submitBtn.dataset.type = 'signUp';
      note.textContent = 'Есть аккаунт на RSLang?';
      linkBtn.textContent = 'Авторизация';
      linkBtn.dataset.type = 'login';
    }
    MAIN.append(fragment);
    this.linkHandler();
    this.submitHandler();
  }

  static linkHandler() {
    const link = document.querySelector('.authorization-link');
    link.addEventListener('click', () => {
      App.reRender(link.dataset.type);
    });
  }

  static submitHandler() {
    const form = document.querySelector('.authorization__form');
    const submit = document.querySelector('.authorization__submit');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = document.querySelector('.invalid-feedback-password');
      const { email, password } = form.elements;
      if (submit.dataset.type === 'signIn') {
        this.loginUser(email, password);
      }
      if (submit.dataset.type === 'signUp') {
        if (!validatePassword(password.value)) {
          message.textContent =
            'Пароль должен содержать не менее 8 символов, как минимум 1 прописную букву, 1 заглавную букву, 1 цифру и 1 спецсимвол +-_@$!%*?&#.,;:[]{}';
          password.classList.add('is-invalid');
        } else {
          this.registerUser(email, password);
        }
      }
    });
  }

  static async registerUser(email, password) {
    const message = document.querySelector('.invalid-feedback-email');
    const url = 'https://afternoon-falls-25894.herokuapp.com/users';
    const user = await HttpService.post(url, { email: email.value, password: password.value });
    if (user === 'user with this e-mail exists') {
      message.textContent = 'пользователь с таким e-mail уже существует';
      email.classList.add('is-invalid');
    } else {
      this.loginUser(email, password);
    }
  }

  static async loginUser(email, password) {
    const message = document.querySelector('.invalid-feedback-password');
    const url = 'https://afternoon-falls-25894.herokuapp.com/signin';
    const user = await HttpService.post(url, { email: email.value, password: password.value });
    if (user.message === 'Authenticated') {
      localStorage.setItem('token', user.token);
      localStorage.setItem('userId', user.userId);
      App.reRender();
    } else {
      message.textContent = 'Неверный e-mail или пароль';
      password.classList.add('is-invalid');
      email.classList.add('is-invalid');
    }
  }
}
