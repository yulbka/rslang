
import { MAIN, routesMap, routeKeys, PRELOADER} from 'scripts/helpers/variables';
import { createElement } from 'scripts/helpers/createElement';
import { validatePassword, validateEmail } from 'scripts/helpers/validate';
import { requestCreator } from 'utils/requests';
import { store } from '../store/index';
import { API_USER } from '../api/user';
import { router } from '../routes';
import { Statistics } from './Statistics';
import { initRequests } from '../index';
export class Authorization {
  static render(type = '#login') {
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
    if (type === routesMap.get(routeKeys.login).url) {
      submitBtn.textContent = 'Войти';
      submitBtn.dataset.type = 'signIn';
      note.textContent = 'Впервые на RSLang?';
      linkBtn.textContent = 'Регистрация';
      linkBtn.dataset.type = routesMap.get(routeKeys.registration).url;
    } else {
      submitBtn.textContent = 'Зарегистрироваться';
      submitBtn.dataset.type = 'signUp';
      note.textContent = 'Есть аккаунт на RSLang?';
      linkBtn.textContent = 'Авторизация';
      linkBtn.dataset.type = routesMap.get(routeKeys.login).url;
    }
    MAIN.append(fragment);
    this.linkHandler();
    this.submitHandler();
    PRELOADER.classList.add('preload-wrapper-hidden');
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
      await API_USER.setUserSettings({ userId: localStorage.getItem('userId'),
        userSettings: {
          "wordsPerDay": 20,
          "optional": {
            "learning": {
              cardsPerDay: 50,
              learnNewWords: true,
              learnOldWords: true,
              withTranslation: true,
              withExplanation: false,
              withExample: false,
              withTranscription: false,
              withHelpImage: true,
              deleteWord: true,
              hardWord: false,
              showAnswerButton: false,
              autoplay: false,
              wordRating: true,
              autoTranslate: false,
            },
            "englishPuzzle": {
              level: 1,
              page: 1,
              autoplay: true,
              translation: true,
              audio: true,
              background: false,
              useLearnedWords: true,
            }
          }
        },
      });
      const today = new Date().toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' });
      await Statistics.set({
        "learnedWords": 0,
        "optional": {
          "short": {
            "day": today,
            "cards": 0,
            "newWords": 0,
            "answers": '',
          },
          "long": {
            [today]: {
              "cards": 0,
              "newWords": 0,
              "mistakes": 0,
            }
          },
        }
      });
      await initRequests();
      router.navigate(routesMap.get(routeKeys.home).url);
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

  static async loginUser(email, password, isInitial = false) {
    try {
      const user = await requestCreator({
        url: '/signin',
        method: requestCreator.methods.post,
        data: { email: email.value, password: password.value },
      });
      localStorage.setItem('token', user.token);
      localStorage.setItem('userId', user.userId);
      store.user.auth = {
        email: email.value,
        password: password.value,
        token: localStorage.getItem('token'),
        userId: localStorage.getItem('userId'),
      };
      if (!isInitial) {
        await initRequests();
        router.navigate(routesMap.get(routeKeys.home).url);
      }
    } catch (error) {
      const message = document.querySelector('.invalid-feedback-password');
      switch (error.message) {
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
