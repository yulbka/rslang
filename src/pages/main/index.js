import { API_USER } from '../../api/user';
import { store } from '../../store';
import { constants } from '../../js/constants';
import { getFormData, setFormData } from '../../components/forms';

export function createSettingsBlock() {
  const rootContainer = document.getElementById('root');
  rootContainer.insertAdjacentHTML(
    'afterbegin',
    `
      <section class="settings-block container">
          <form name="userSettings" class="rs-form">
            <div class="rs-form-field">
                <label class="rs-field-label" for="wordsPerDay">Количество слов в день:</label>
                <input class="rs-field-input" type="number" id="wordsPerDay" name="wordsPerDay" min="1" max="1000">
                <div class="rs-field-error alert alert-danger"></div>
            </div>
            <input type="number" id="cardsPerDay" name="cardsPerDay" min="1" max="1000">
            <label for="wordsPerDay">Количество карточек в день:</label>
            <input type="checkbox" id="withTranslation" name="withTranslation" value="0">
            <label for="withTranslation">Перевод слова:</label>
            <input type="checkbox" id="withExplanation" name="withExplanation" value="false" value="1">
            <label for="withExplanation">Предложение с объяснением значения слова:</label>
            <input type="checkbox" id="withExample" name="withExample" value="true" checked="false">
            <label for="withExample">Предложение с примером использования изучаемого слова:</label>
            <input type="checkbox" id="withTranscription" name="withTranscription" value="false" checked="false"> 
            <label for="withTranscription">Транскрипция слова:</label>
            <input type="checkbox" id="withHelpImage" name="withHelpImage" checked>
            <label for="withHelpImage">Картинка-ассоциация:</label>
            <input type="checkbox" id="showAnswerButton" name="showAnswerButton" value="true" checked="true">
            <label for="showAnswerButton">Кнопка отображения перевода:</label>
            <button class="btn btn-primary">Применить настройки</button>
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
