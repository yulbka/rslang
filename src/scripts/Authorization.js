export class Authorization {

  static renderAuthorizationPage(type = 'login') {
    const fragment = document.createDocumentFragment();
    const wrapper = createElement('div', fragment, ['authorization__wrapper']);
    const form = createElement('form', wrapper, ['authorization__form']);
    const formGroup1 = createElement('div', form, ['form-group']);
    createElement('label', formGroup1, [], 'Email', 'for', 'email' );
    createElement('input', formGroup1, ['form-control'], '', 'type', 'email');
    const formGroup2 = createElement('div', form, ['form-group']);
    createElement('label', formGroup2, [], 'Пароль', 'for', 'password');
    createElement('input', formGroup2, ['form-control'], '', 'type', 'password');
    const submitBtn = createElement('button', form, ['btn', 'btn-primary', 'authorization__submit']);
    const note = createElement('p', wrapper, ['text-muted', 'authorization__text']);
    const linkBtn = createElement('button', wrapper, ['btn', 'btn-outline-secondary', 'btn-sm', 'authorization-link']);
    if (type === 'login') {
      submitBtn.textContent = 'Войти';
      note.textContent = 'Впервые на RSLang?';
      linkBtn.textContent =  'Регистрация';
      linkBtn.dataset.type = 'registration';
    } else {
      submitBtn.textContent = 'Зарегистрироваться';
      note.textContent = 'Есть аккаунт на RSLang?';
      linkBtn.textContent =  'Авторизация';
      linkBtn.dataset.type = 'login';
    }
    MAIN.append(fragment);
    this.linkHandler();
  }

  static linkHandler() {
    const link =
    document.querySelector('.authorization-link');
    link.addEventListener('click', () => {
      router.navigate(link.dataset.type);
    });
  }
}