import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../css/dictionary.scss';
import { store } from '../store';
import { WordService } from './service/Word.Service';
import { API_USER } from '../api/user';

export async function create_dictionary() {
  const main = document.getElementById('main');
  const base = 'https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/';

  const userSettings = await API_USER.getUserSettings({ userId: localStorage.getItem('userId') });
  store.user.learning = {
    ...store.user.learning,
    ...userSettings,
  };

  const settings = store.user.learning;

  const { withExample } = settings;
  const { withExplanation } = settings;
  const { withHelpImage } = settings;
  const { withTranscription } = settings;
  const { withTranslation } = settings;

  function create_started_table(
    dowithExample,
    dowithExplanation,
    dowithHelpImage,
    dowithTranscription,
    dowithTranslation
  ) {
    const main_container = `
        <div class="container" id="container">
        <div class='buttons'>
            <div class='button_div'>
                <button type="button" class="btn btn-primary filter_button" id="filter_a">Фильтровать</button>
            </div>
            <div class='button_div'>
                <button type="button" class="btn btn-info filter_button" id="filter_all">Все слова</button>
                <button type="button" class="btn btn-success filter_button" id="filter_learn">Изучаемые слова</button>
                <button type="button" class="btn btn-warning filter_button" id="filter_hard">Сложные слова</button>
                <button type="button" class="btn btn-danger filter_button" id="filter_delete">Удалённые слова</button>
            </div>
        </div>
        <div>
            <input type='text' class='main_input_area' id='search_string' placeholder="Поиск слов">
        </div>
        <div class="table-responsive">
            <table class="table table-sortable" id='table_id'>
            <thead>
                <tr id='thead_id'>
                <th>Аудио</th>
                <th class="th-sort-asc" id='word'>Слово</th>

                </tr>
            </thead>
                <tbody id="tBody">
                </tbody>
            </table>
        </div>
        </>
        `;
    main.innerHTML += main_container;
    if (dowithHelpImage === true) {
      document.getElementById('thead_id').innerHTML += `<th>Картинка</th>`;
    }
    if (dowithTranscription === true) {
      document.getElementById('thead_id').innerHTML += `<th>Транскрипция</th>`;
    }
    if (dowithTranslation === true) {
      document.getElementById('thead_id').innerHTML += `<th>Перевод</th>`;
    }
    if (dowithExample === true) {
      document.getElementById('thead_id').innerHTML += `<th>Пример в тексте</th>`;
    }
    if (dowithExplanation === true) {
      document.getElementById('thead_id').innerHTML += `<th>Объяснение слова</th>`;
    }
  }

  create_started_table(withExample, withExplanation, withHelpImage, withTranscription, withTranslation);
  create_default_dictionary();

  const tBody = document.getElementById('tBody');

  WordService.getWordsByLevelAndPage().then((data) => {
    create_table(data);
  });

  function create_default_dictionary() {
    const bottom_buttons = `
        <div class="bottom_buttons" id='bottom_buttons'>
            <button type="button" class="btn btn-primary" id="previousPage">Предыдущая страница</button>
            <button type="button" class="btn btn-primary" id="nextPage">Следующая страница</button>
        </div>       
        `;
    document.getElementById('container').innerHTML += bottom_buttons;
  }

  document.getElementById('filter_all').addEventListener('click', () => {
    WordService.getWordsByLevelAndPage().then((data) => {
      create_table(data);
      document.getElementById('bottom_buttons').classList.remove('hide');
    });
  });

  document.getElementById('nextPage').addEventListener('click', () => {
    WordService.getMoreWordsByLevelAndPage().then((data) => {
      create_table(data);
    });
  });

  document.getElementById('previousPage').addEventListener('click', () => {
    WordService.page -= 1;
    WordService.getWordsByLevelAndPage().then((data) => {
      create_table(data);
    });
  });

  function create_table(data) {
    tBody.innerHTML = '';
    data.map((item) =>
      create_one_cell(
        item.id,
        item.audio,
        item.image,
        item.word,
        item.transcription,
        item.wordTranslate,
        item.textExample,
        item.textMeaning
      )
    );
  }

  function create_one_cell(id, audio, image, word, transcription, wordTranslate, textExample, textMeaning) {
    tBody.innerHTML += `<tr id="${id}">
            <td><img src='https://i.ibb.co/FxW8BS6/321.png' class='small_icon' data-audio='${base}${audio}'></td>
            <td>${word}</td>
            </tr>`;
    if (withHelpImage === true) {
      document.getElementById(`${id}`).innerHTML += `<td><img src='${base}${image}' class='small_img'></td>`;
    }
    if (withTranscription === true) {
      document.getElementById(`${id}`).innerHTML += `<td>${transcription}</td>`;
    }
    if (withTranslation === true) {
      document.getElementById(`${id}`).innerHTML += `<td>${wordTranslate}</td>`;
    }
    if (withExample === true) {
      document.getElementById(`${id}`).innerHTML += `<td>${textExample}</td>`;
    }
    if (withExplanation === true) {
      document.getElementById(`${id}`).innerHTML += `<td>${textMeaning}</td>`;
    }
  }

  function create_unusual_table(data) {
    tBody.innerHTML = '';
    data.map((item) =>
      create_one_unusual_cell(
        item._id,
        item.audio,
        item.image,
        item.word,
        item.transcription,
        item.wordTranslate,
        item.textExample,
        item.textMeaning
      )
    );
  }

  function create_current_words_table(data) {
    tBody.innerHTML = '';
    document.getElementById('thead_id').innerHTML += `
        <th>Последнее повторение</th>
        <th>Следующие повторение</th>
        <th>Количество повторений</th>`;
    data.map((item) =>
      create_one_cell_for_learned_words(
        item._id,
        item.audio,
        item.image,
        item.word,
        item.transcription,
        item.wordTranslate,
        item.textExample,
        item.textMeaning,
        item.userWord.optional.lastDayRepeat,
        item.userWord.optional.nextDayRepeat,
        `${Number(item.userWord.optional.mistakeCount) + Number(item.userWord.optional.progressCount)}`
      )
    );
  }

  function recover(wordId) {
    WordService.updateUserWord(wordId, 'normal', { category: 'learned' });
  }

  function create_one_unusual_cell(id, audio, image, word, transcription, wordTranslate, textExample, textMeaning) {
    tBody.innerHTML += `<tr id="${id}">
        <td><img src='https://i.ibb.co/FxW8BS6/321.png' class='small_icon' data-audio='${base}${audio}'></td>
        <td>${word}</td>
      </tr>`;
    if (withHelpImage === true) {
      document.getElementById(`${id}`).innerHTML += `<td><img src='${base}${image}' class='small_img'></td>`;
    }
    if (withTranscription === true) {
      document.getElementById(`${id}`).innerHTML += `<td>${transcription}</td>`;
    }
    if (withTranslation === true) {
      document.getElementById(`${id}`).innerHTML += `<td>${wordTranslate}</td>`;
    }
    if (withExample === true) {
      document.getElementById(`${id}`).innerHTML += `<td>${textExample}</td>`;
    }
    if (withExplanation === true) {
      document.getElementById(`${id}`).innerHTML += `<td>${textMeaning}</td>`;
    }
    document.getElementById(
      `${id}`
    ).innerHTML += `<td><button type="button" class="btn btn-danger" id="filter_recover_word" data-word='${id}'>Восстановить</button></td>`;
  }

  function create_one_cell_for_learned_words(
    id,
    audio,
    image,
    word,
    transcription,
    wordTranslate,
    textExample,
    textMeaning,
    lastDayRepeat,
    nextDayRepeat,
    total_count
  ) {
    const lastDayRepeat_new = new Date(lastDayRepeat).toLocaleString(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    const nextDayRepeat_new = new Date(nextDayRepeat).toLocaleString(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });

    tBody.innerHTML += `<tr id="${id}">
        <td><img src='https://i.ibb.co/FxW8BS6/321.png' class='small_icon' data-audio='${base}${audio}'></td>
        <td>${word}</td>
      </tr>`;
    if (withHelpImage === true) {
      document.getElementById(`${id}`).innerHTML += `<td><img src='${base}${image}' class='small_img'></td>`;
    }
    if (withTranscription === true) {
      document.getElementById(`${id}`).innerHTML += `<td>${transcription}</td>`;
    }
    if (withTranslation === true) {
      document.getElementById(`${id}`).innerHTML += `<td>${wordTranslate}</td>`;
    }
    if (withExample === true) {
      document.getElementById(`${id}`).innerHTML += `<td>${textExample}</td>`;
    }
    if (withExplanation === true) {
      document.getElementById(`${id}`).innerHTML += `<td>${textMeaning}</td>`;
    }
    document.getElementById(`${id}`).innerHTML += `<td>${lastDayRepeat_new}</td>
    <td>${nextDayRepeat_new}</td>
    <td>${total_count}</td>
    `;
  }

  tBody.addEventListener('click', () => {
    const element = event.target.closest('button');
    if (element == null) {
      return;
    }
    recover(element.dataset.word);
    element.parentElement.parentElement.style.display = 'none';
  });

  function filter_by_a_search() {
    let input = document.getElementById('search_string');
    let filter = input.value.toUpperCase();
    let a;
    let i;
    input = document.getElementById('search_string');
    filter = input.value.toUpperCase();
    const tr = tBody.getElementsByTagName('tr');

    for (i = 0; i < tr.length; i++) {
      a = tr[i];
      if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = '';
      } else {
        tr[i].style.display = 'none';
      }
    }
  }

  document.getElementById('search_string').addEventListener('keyup', filter_by_a_search);

  function play_audio(url) {
    new Audio(url).play();
  }

  main.addEventListener('click', () => {
    const element = event.target.closest('img');
    if (element == null) {
      return;
    }
    play_audio(element.dataset.audio);
  });

  function sort_table_by_column(table, column, asc = true) {
    const dirMod = asc ? 1 : -1;
    const rows = Array.from(tBody.querySelectorAll('tr'));
    const sorted_rows = rows.sort((a, b) => {
      const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
      const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();

      return aColText > bColText ? 1 * dirMod : -1 * dirMod;
    });

    tBody.append(...sorted_rows);

    document.getElementById('word').classList.remove('th-sort-asc', 'th-sort-desc');
    document.getElementById('word').classList.toggle('th-sort-desc', !asc);
    document.getElementById('word').classList.toggle('th-sort-asc', asc);
  }

  document.getElementById('filter_a').addEventListener('click', () => {
    const headerCell = document.getElementById('word');
    const tableElement = headerCell.parentElement.parentElement.parentElement;
    const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
    const currentIsAscending = headerCell.classList.contains('th-sort-asc');

    sort_table_by_column(tableElement, headerIndex, !currentIsAscending);
  });

  document.getElementById('filter_learn').addEventListener('click', () => {
    WordService.getWordsByCategory('learned').then((data) => {
      create_current_words_table(data);
      document.getElementById('bottom_buttons').classList.add('hide');
    });
  });

  document.getElementById('filter_hard').addEventListener('click', () => {
    WordService.getWordsByCategory('difficult').then((data) => {
      create_unusual_table(data);
      document.getElementById('bottom_buttons').classList.add('hide');
    });
  });

  document.getElementById('filter_delete').addEventListener('click', () => {
    WordService.getWordsByCategory('deleted').then((data) => {
      create_unusual_table(data);
      document.getElementById('bottom_buttons').classList.add('hide');
    });
  });
}
