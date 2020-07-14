import $ from 'jquery';
import { API_USER } from 'api/user';
import { store } from 'store';
import { constants } from 'js/constants';
import { getFormData, setFormData } from 'components/forms';
import { gamesMap, routeKeys, routesMap } from 'scripts/helpers/variables';
import { createPopupNotification } from 'components/popup/popup';
import { createElement } from '../../scripts/helpers/createElement';
import { router } from '../../routes/index';

function createSettingsBlock() {
  document.body.classList.add('main-page');
  const mainPageContainer = createElement('div', constants.DOM.main, ['container', 'main-page-container']);
  mainPageContainer.insertAdjacentHTML(
    'beforeend',
    `
      <section class="settings-block">
          <h2>Настройки</h2> 
          <form name="userSettings" class="rs-form">
            <div class="option-block">
              <h6>Выберите:</h6>
              <div class="alert alert-danger error-message cards-error">Количество новых слов должно быть меньше количества карточек в день!</div>
              <div class="rs-form-field rs-input rs-label-left">
                  <label class="rs-field-label" for="wordsPerDay">Количество новых слов в день:</label>
                  <input class="rs-field-input" type="number" id="wordsPerDay" name="wordsPerDay" min="1" max="100" autocomplete="off">
              </div>
              <div class="rs-form-field rs-input rs-label-left">
                  <label class="rs-field-label" for="wordsPerDay">Количество карточек в день:</label>
                  <input class="rs-field-input" type="number" id="cardsPerDay" name="cardsPerDay" min="1" max="100" autocomplete="off">
              </div>
            </div>
            <div class="option-block">
                <h6>Показывать:</h6>
                <div class="rs-form-field custom-control custom-checkbox">
                    <input class="custom-control-input is-required-field" type="checkbox" id="learnNewWords" name="learnNewWords">
                    <label class="custom-control-label" for="learnNewWords">новые слова</label>
                </div>
                <div class="rs-form-field custom-control custom-checkbox">
                    <input class="custom-control-input is-required-field" type="checkbox" id="learnOldWords" name="learnOldWords">
                    <label class="custom-control-label" for="learnOldWords">изученные слова</label>
                </div>
            </div>
            <div class="option-block block-with-required-field"> 
                <h6>Показывать в карточке:</h6>
                <div class="alert alert-danger error-message options-error">Выберите одну из опций!</div>
                <div class="rs-form-field custom-control custom-checkbox">
                    <input type="checkbox" id="withTranslation" name="withTranslation" class="custom-control-input is-required-field">
                    <label for="withTranslation" class="custom-control-label">перевод слова:</label>
                </div>
                <div class="rs-form-field custom-control custom-checkbox">
                    <input type="checkbox" id="withExplanation" name="withExplanation" class="custom-control-input is-required-field">
                    <label for="withExplanation" class="custom-control-label">предложение с объяснением значения слова:</label>
                 </div>
                <div class="rs-form-field custom-control custom-checkbox">
                    <input type="checkbox" id="withExample" name="withExample" class="custom-control-input is-required-field">
                    <label for="withExample" class="custom-control-label">предложение с примером использования изучаемого слова:</label>
                </div>
            </div>
                <div class="option-block"> 
                <h6>Добавить в карточку:</h6>
                <div class="rs-form-field custom-control custom-checkbox">
                    <input type="checkbox" id="withTranscription" name="withTranscription" class="custom-control-input"> 
                    <label for="withTranscription" class="custom-control-label">транскрипцию слова:</label>
                </div>
                <div class="rs-form-field custom-control custom-checkbox">
                    <input type="checkbox" id="withHelpImage" name="withHelpImage" class="custom-control-input">
                    <label for="withHelpImage" class="custom-control-label">картинку-ассоциацию:</label>
                </div>
                <div class="rs-form-field custom-control custom-checkbox">
                    <input type="checkbox" id="showAnswerButton" name="showAnswerButton"  class="custom-control-input" checked>
                    <label for="showAnswerButton" class="custom-control-label">кнопку "Показать ответ":</label>
                </div>
            </div>
            <div class="option-block"> 
                <h6>Добавить возможность:</h6>
                <div class="rs-form-field custom-control custom-checkbox">
                    <input type="checkbox" id="deleteWord" name="deleteWord" class="custom-control-input">
                    <label for="deleteWord" class="custom-control-label">исключать слова из изучения</label>
                </div>
                <div class="rs-form-field custom-control custom-checkbox">	
                    <input type="checkbox" id="hardWord" name="hardWord" class="custom-control-input">	
                    <label for="hardWord" class="custom-control-label">добавлять слова в сложные</label>	
                </div>
                <div class="sound-button-block rs-form-field custom-control custom-checkbox">
                    <input type="checkbox" id="autoplay" name="autoplay" class="sound-button-input custom-control-input" checked>
                    <label for="autoplay" class="sound-button-label custom-control-label">автовоспроизведение звука</label>
                </div>
                <div class="sound-button-block rs-form-field custom-control custom-checkbox">
                    <input type="checkbox" id="wordRating" name="wordRating" class="custom-control-input" checked>
                    <label for="wordRating" class="custom-control-label">оценить сложность слова</label>
                </div>
                <div class="sound-button-block rs-form-field custom-control custom-checkbox">
                    <input type="checkbox" id="autoTranslate" name="autoTranslate" class="custom-control-input">
                    <label for="autoTranslate" class="custom-control-label">показать перевод отгаданного слова</label>
                </div>
            </div>
            <div class="settings-buttons-block">
                <button class="btn btn-primary settings-button">Применить настройки</button>
            </div>
          </form>
       </section>
       ${createPopupNotification()};
      `
  );
  $('.rs-notification').toast({ autohide: true, delay: 5000 });
  const { userSettingsForm } = constants.DOM;
  setFormData({ form: userSettingsForm, formData: store.user.learning });

  userSettingsForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    let firstFormError = null;

    const { wordsPerDay, ...restFormData } = getFormData({ form: userSettingsForm });

    validateAmountOfWords();
    validateShowInCards();

    if (firstFormError) {
      firstFormError.scrollIntoView({ block: 'center', behavior: 'smooth' });
      throw Error;
    }

    try {
      const settings = await API_USER.getUserSettings({
        userId: store.user.auth.userId
      });
      const newSettings = await API_USER.setUserSettings({
        userId: store.user.auth.userId,
        userSettings: {
          wordsPerDay,
          optional: {
            learning: restFormData,
            englishPuzzle: settings.englishPuzzle,
          },
        },
      });
      console.log(newSettings)
      $('.toast').toast('show');
      store.user.learning = {
        ...store.user.learning,
        wordsPerDay: newSettings.wordsPerDay,
        ...newSettings.optional,
      };
    } catch (error) {
      console.error(error);
    }

    function validateAmountOfWords() {
      const newWordsAmount = wordsPerDay;
      const { cardsPerDay: newCardsAmount } = restFormData;
      const isValidAmounOfWords = +newWordsAmount > +newCardsAmount;
      if (isValidAmounOfWords) {
        const errorBlock = userSettingsForm.querySelector('.cards-error');
        errorBlock.classList.add('active');
        if (!firstFormError) firstFormError = errorBlock;
      } else userSettingsForm.querySelector('.cards-error').classList.remove('active');
    }

    function validateShowInCards() {
      const requiredFieldsBlock = userSettingsForm.querySelector('.block-with-required-field');
      const fields = requiredFieldsBlock.querySelectorAll('.is-required-field');
      const errorBlock = requiredFieldsBlock.querySelector('.options-error');
      const hasSomeoneChecked = Array.from(fields).some((el) => el.checked);
      if (!hasSomeoneChecked) {
        errorBlock.classList.add('active');
        if (!firstFormError) firstFormError = errorBlock;
      } else {
        errorBlock.classList.remove('active');
      }
    }
  });
}

function createButtonToLearningWords() {
  const mainPageContainer = document.querySelector('.main-page-container');
  mainPageContainer.insertAdjacentHTML(
    'afterbegin',
    `<button class="btn btn-info button-to-learning">Перейти к изучению слов</button>`
  );
  const buttonLearning = document.querySelector('.button-to-learning');
  buttonLearning.addEventListener('click', () => {
    router.navigate(routesMap.get(routeKeys.learn).url);
  });
}

function createBlockWithGames({ gamesData }) {
  const mainPageContainer = document.querySelector('.main-page-container');
  mainPageContainer.insertAdjacentHTML(
    'afterbegin',
    `
        <section class="previews-container">
           ${gamesData
             .map(
               (game) =>
                 `<a href="${game.url}" class="preview-block">
                <p>${game.title}</p>
                <img src="${game.preview}"/>
            </a>`
             )
             .join('')}
        </section>
        `
  );
}

export function pageHomeCreate() {
  createSettingsBlock();
  createButtonToLearningWords();
  createBlockWithGames({ gamesData: gamesMap });
}
