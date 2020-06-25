export const MAIN = document.querySelector('#main');
export const SIDEBAR = document.querySelector('#sidebar');

export const constants = {
  DOM: {
    get userSettingsForm() {
      return document.forms.userSettings;
    },
    get rootContainer() {
      return document.getElementById('root');
    },
    get main() {
      return document.querySelector('#main');
    },
  },
};
