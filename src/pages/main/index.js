import { API_USER } from '../../api/user';
import { store } from '../../store';
import { constants } from '../../js/constants';
import { getFormData, setFormData } from '../../components/forms';

export function createSettingsBlock() {
  document.body.classList.add('main-page');
  constants.DOM.main.classList.add('container', 'main-page-container');
  constants.DOM.main.insertAdjacentHTML(
    'beforeend',
    `
      <section class="settings-block">
          <h2>Настройки</h2> 
          <form name="userSettings" class="rs-form">
            <div class="option-block">
              <h6>Выберите:</h6>
                <div class="rs-form-field">
                    <label class="rs-field-label" for="wordsPerDay">Количество слов в день:</label>
                    <input class="rs-field-input" type="number" id="wordsPerDay" name="wordsPerDay" min="1" max="1000" autocomplete="off">
                    <div class="rs-field-error alert alert-danger"></div>
                </div>
                <div class="rs-form-field">
                    <label for="wordsPerDay">Количество карточек в день:</label>
                    <input type="number" id="cardsPerDay" name="cardsPerDay" min="1" max="1000" autocomplete="off">
                <div class="rs-field-error alert alert-danger"></div>
                </div>
            </div>
            <div class="option-block block-with-required-field"> 
                <h6>Показывать в карточке:</h6>
                <div class="alert alert-danger error-message">Выберите одну из опций!</div>
                <div class="rs-form-field custom-control custom-checkbox">
                    <input type="checkbox" id="withTranslation" name="withTranslation" value="true" class="custom-control-input is-required-field">
                    <label for="withTranslation" class="custom-control-label">Перевод слова:</label>
                </div>
                <div class="rs-form-field custom-control custom-checkbox">
                    <input type="checkbox" id="withExplanation" name="withExplanation" value="false" class="custom-control-input is-required-field">
                    <label for="withExplanation" class="custom-control-label">Предложение с объяснением значения слова:</label>
                 </div>
                <div class="rs-form-field custom-control custom-checkbox">
                    <input type="checkbox" id="withExample" name="withExample" value="true" checked="false" class="custom-control-input is-required-field">
                    <label for="withExample" class="custom-control-label">Предложение с примером использования изучаемого слова:</label>
                </div>
            </div>
                <div class="option-block"> 
                <h6>Добавить в карточку:</h6>
                <div class="rs-form-field custom-control custom-checkbox">
                    <input type="checkbox" id="withTranscription" name="withTranscription" value="false" class="custom-control-input"> 
                    <label for="withTranscription" class="custom-control-label">Транскрипцию слова:</label>
                </div>
                <div class="rs-form-field custom-control custom-checkbox">
                    <input type="checkbox" id="withHelpImage" name="withHelpImage" class="custom-control-input">
                    <label for="withHelpImage" class="custom-control-label">Картинку-ассоциацию:</label>
                </div>
                <div class="rs-form-field custom-control custom-checkbox">
                    <input type="checkbox" id="showAnswerButton" name="showAnswerButton" value="true"  class="custom-control-input" checked>
                    <label for="showAnswerButton" class="custom-control-label">Кнопку перевода:</label>
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
            </div>
             
            <div class="settings-buttons-block">
                <button class="btn btn-primary settings-button">Применить настройки</button>
            </div>
          </form>
       </section>
      `
  );

  const { userSettingsForm } = constants.DOM;
  setFormData({ form: userSettingsForm, formData: store.user.learning });

  userSettingsForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const { wordsPerDay, ...restFormData } = getFormData({ form: userSettingsForm });
    try {
      const newSettings = await API_USER.setUserSettings({
        userId: store.user.auth.userId,
        userSettings: {
          wordsPerDay,
          optional: restFormData,
        },
      });
      store.user.learning = {
        ...store.user.learning,
        wordsPerDay: newSettings.wordsPerDay,
        ...newSettings.optional,
      };
    } catch (error) {
      console.error(error);
    }
  });
}
