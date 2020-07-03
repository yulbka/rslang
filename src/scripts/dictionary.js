import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../css/dictionary.scss';


export function create_dictionary() {
    const main = document.getElementById('main');

    function create_started_table() {
        const main_container = `
        <div class="container">
        <div class='buttons'>
            <div>
                <button type="button" class="btn btn-primary filter_button" id="filter_a">Фильтровать по убыванию и возрастанию</button>
            </div>
            <div>
                <button type="button" class="btn btn-success filter_button" id="filter_a">Изучаемые слова</button>
                <button type="button" class="btn btn-warning filter_button" id="filter_a">Сложные слова</button>
                <button type="button" class="btn btn-danger filter_button" id="filter_a">Удалённые слова</button>
            </div>
        </div>
        <div><input type='text' class='main_input_area' id='search_string' placeholder="Search for words"></div>
        <table class="table table-sortable" id='table_id'>
          <thead>
            <tr>
              <th>Audio</th>
              <th>Image</th>
              <th class="th-sort-asc" id='word'>Word</th>
              <th>Transcription</th>
              <th>Translate</th>
            </tr>
          </thead>
            <tbody id="tBody">
            </tbody>
        </table>
        <div class="bottom_buttons">
            <button type="button" class="btn btn-primary" id="previousPage">Previous page</button>
            <button type="button" class="btn btn-primary" id="nextPage">Next page</button>
        </div>
        </>
        `;
        main.innerHTML += main_container;
    }
    
    create_started_table();

}