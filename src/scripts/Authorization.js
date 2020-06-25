import { MAIN } from './helpers/variables';
import { createElement } from './helpers/createElement';
import { validatePassword, validateEmail } from './helpers/validate';
import { router } from '../routes/index';
import { requestCreator } from '../utils/requests';
import { API_USER } from '../api/user';
import { store } from '../store';

export class Authorization {
  static render(type = 'login') {
    const fragment = document.createDocumentFragment();
    const wrapper = createElement('div', fragment, ['authorization__wrapper']);
    const form = createElement('form', wrapper, ['authorization__form']);
    const formGroup1 = createElement('div', form, ['form-group', 'is-invalid']);
    createElement('label', formGroup1, [], 'Email', 'for', 'email');
    const email = createElement('input', formGroup1, ['form-control'], '', 'required', '');
    email.id = 'email';
    email.type = 'text';
    createElement('div', formGroup1, ['invalid-feedback', 'invalid-feedback-email']);
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
      router.navigate(link.dataset.type);
    });
  }

  static submitHandler() {
    const form = document.querySelector('.authorization__form');
    const submit = document.querySelector('.authorization__submit');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const { email, password } = form.elements;
      if (submit.dataset.type === 'signIn') {
        this.loginUser(email, password);
      }
      if (submit.dataset.type === 'signUp') {
        const emailMessage = document.querySelector('.invalid-feedback-email');
        const passwordMessage = document.querySelector('.invalid-feedback-password');
        emailMessage.textContent = '';
        passwordMessage.textContent = '';
        email.classList.remove('is-invalid');
        password.classList.remove('is-invalid');
        if (!validateEmail(email.value) || !validatePassword(password.value)) {
          if (!validatePassword(password.value)) {          
            passwordMessage.textContent =
              'Пароль должен содержать не менее 8 символов, как минимум 1 прописную букву, 1 заглавную букву, 1 цифру и 1 спецсимвол +-_@$!%*?&#.,;:[]{}';
            password.classList.add('is-invalid');
          }
          if (!validateEmail(email.value)) {          
            emailMessage.textContent = 'Необходимо ввести валидный e-mai';
            email.classList.add('is-invalid');
          }        
        } else {
          this.registerUser(email, password);
        }
      }
    });
  }

  static async registerUser(email, password) {
    try {
      await requestCreator({
        url: '/users',
        method: requestCreator.methods.post,
        data: { email: email.value, password: password.value },
      });
      await this.loginUser(email, password);
      const { wordsPerDay, ...restSettings } = store.user.learning;
      await API_USER.setUserSettings({
        userId: localStorage.getItem('userId'),
        userSettings: {
          wordsPerDay,
          optional: restSettings,
        },
      });
      // TODO: add initial statistic
    } catch (error) {
      const emailMessage = document.querySelector('.invalid-feedback-email');
      const passwordMessage = document.querySelector('.invalid-feedback-password');
      switch (error.message) {
        case '417':
          emailMessage.textContent = 'Пользователь с таким e-mail уже существует';
          break;
        case '422':
          passwordMessage.textContent = 'Неверный e-mail или пароль';
          password.classList.add('is-invalid');
          break;
        default:
          passwordMessage.textContent = 'Что-то пошло не так';
          password.classList.add('is-invalid');
      }
      email.classList.add('is-invalid');
    }
  }

  static async loginUser(email, password) {
    try {
      const user = await requestCreator({
        url: '/signin',
        method: requestCreator.methods.post,
        data: { email: email.value, password: password.value },
      });      
      localStorage.setItem('token', user.token);
      localStorage.setItem('userId', user.userId);
      store.user.auth = {
        ...store.user.auth,
        email: email.value,
        password: password.value,
      };
      router.navigate('/');
    } catch (error) {
      const message = document.querySelector('.invalid-feedback-password');
      switch(error.message) {
        case '404':
          message.textContent = 'Пользователь не найден';
          break;
        case '403':
          message.textContent = 'Неверный e-mail или пароль';
          break;
        default:
          message.textContent = 'Что-то пошло не так';
      }
      password.classList.add('is-invalid');
      email.classList.add('is-invalid');
    }
  }
}
