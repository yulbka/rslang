import { constants } from 'js/constants';

export function aboutTeamCreate() {
  const { main } = constants.DOM;
  document.body.className = 'about-team content-page';
  main.insertAdjacentHTML(
    'afterbegin',
    `
      <section class="container about-team-section">
         <h1 class="title">Наша команда</h1>
      </section> 
    `
  );
  createAboutPersons(personsMap);
}

function createAboutPersons(personsMap) {
  const aboutSection = document.querySelector('.about-team-section');
  aboutSection.insertAdjacentHTML(
    'beforeend',
    `
    <div class="about-team-block">
        ${Array.from(personsMap)
          .map(
            (person) =>
              `<article class="block-with-person">
                  <img src="${person[1].photo}" width="300" height="300" alt="person-photo">
                  <h3 class="person-name">${person[0]}</h3>
                  ${person[1].description}
               </article>`
          )
          .join('')}
        </div>
        `
  );
}

const personsMap = new Map([
  [
    'Павел',
    {
      photo: require('assets/img/team/Pavel(mentor).jpg').default,
      description:
      `<p class="person-description"><b>Frontend developer (3 года)</b></p>
       <p class="person-description"><b>Технологический стек:</b></br>React, Angular, React Native.</p>
       <p class="person-description"><b>Вклад в проект:</b></br>Координировал деятельность команды, принимал участие в обсуждении разработки, настроил инструмент для совместной работы, проводил code-review</p>`,
    },
  ],
  [
    'Юлия',
    {
      photo: require('assets/img/team/Yulia.jpg').default,
      description: `
      <p class="person-description"><b>Разработала:</b><br/>Страницы изучения слов, регистрации и авторизации, график прогресса изучения слов, мини-игру "Английский пазл", методику интервального повторения</p>
      <p class="person-description"><b>Принимала участие:</b><br/>В обсуждении разработки, code-review</p>`
    },
  ],
  [
    'Марианна',
    {
      photo: require('assets/img/team/Marianna.jpg').default,
      description: `
        <p class="person-description"><b>Настроила:</b><br/>Webpack, PostCSS, linters, git hooks</p>
        <p class="person-description"><b>Спроектировала:</b><br/>Global store, routing, requestCreator</p>
        <p class="person-description"><b>Разработала:</b><br/>Страницы "Главная" и "О команде", мини-игру "Аудиовызов"</p>
        <p class="person-description"><b>Принимала участие:</b><br/>В обсуждении разработки, code-review, видео о приложении</p>
      `
    },
  ],
  [
    'Павел ',
    {
      photo: require('assets/img/team/Pavel.jpg').default,
      description: `
        <p class="person-description"><b>Разработал:</b><br/>Sidebar, мини-игры "Произнеси слово" и "Саванна"</p>
        <p class="person-description"><b>Принимал участие:</b><br/>В обсуждении разработки, code-review</p>`
    },
  ],
  [
    'Сергей',
    {
      photo: require('assets/img/team/Sergey.jpg').default,
      description:
          `<p class="person-description"><b>Разработал:</b><br/>Мини-игру "Висельница", страницу "Словарь", участие в создании видео о команде.</p>
           <p class="person-description"><b>Принимал участие:</b><br/>В обсуждении разработки, видео о приложении</p>`
    },
  ],
  ['Виктория', { photo: require('assets/img/team/Victoria.jpg').default, description: '<p class="person-description"><b>Разработала:</b><br/>Мини-игру "Спринт"</p>' }],
]);
