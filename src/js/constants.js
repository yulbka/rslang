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
    get word() {
      return this.main.querySelector('.word');
    },
    get level() {
      return this.main.querySelector('.level');
    },
    get btns() {
      return this.main.querySelector('.btns');
    },
    get btnStart() {
      return this.main.querySelector('.btn__start');
    },
    get resultsTable() {
      return this.main.querySelector('.results__table');
    },
    get startScreen() {
      return this.main.querySelector('.start');
    },
  },
};
