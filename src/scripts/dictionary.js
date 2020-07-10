import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../css/dictionary.scss';
import {WordService} from './service/Word.Service';

export function create_dictionary() {
    const main = document.getElementById('main');
    const base = 'https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/';

    function create_started_table() {
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
            <input type='text' class='main_input_area' id='search_string' placeholder="Search for words">
        </div>
        <div class="table-responsive">
            <table class="table table-sortable" id='table_id'>
            <thead>
                <tr>
                <th>Audio</th>
                <th>Image</th>
                <th class="th-sort-asc" id='word'>Word</th>
                <th>Transcription</th>
                <th>Translate</th>
                <th>Total count</th>
                </tr>
            </thead>
                <tbody id="tBody">
                </tbody>
            </table>
        </div>
        <div class="bottom_buttons">
            <button type="button" class="btn btn-primary" id="previousPage">Previous page</button>
            <button type="button" class="btn btn-primary" id="nextPage">Next page</button>
        </div>  
        </>
        `;
        main.innerHTML += main_container;
    }
    
    create_started_table();

    const tBody = document.getElementById('tBody');

    WordService.getWordsByLevelAndPage().then(data => {
        create_table(data);
    })


    // function create_default_dictionary(){
    //     const bottom_buttons = `
    //     <div class="bottom_buttons">
    //         <button type="button" class="btn btn-primary" id="previousPage">Previous page</button>
    //         <button type="button" class="btn btn-primary" id="nextPage">Next page</button>
    //     </div>       
    //     `;
    //     document.getElementById('container').innerHTML += bottom_buttons;
    // }


    
    // document.getElementById('nextPage').addEventListener('click', () => {
    //     WordService.getMoreWords().then(data => {
    //       create_table(data);
    //     })
    // });
    document.getElementById('filter_all').addEventListener('click', () => {
        WordService.getWordsByLevelAndPage().then(data => {
            create_table(data);
        })  
    })

    document.getElementById('nextPage').addEventListener('click', () => {
        WordService.getMoreWordsByLevelAndPage().then(data => {
          create_table(data);
        })
    });

    document.getElementById('previousPage').addEventListener('click', () => {
      WordService.page -= 1;
      WordService.getWordsByLevelAndPage().then(data => {
        create_table(data);
    })
    });

    let final_count;
    // let amount;
    
    function create_table(data) {
        tBody.innerHTML = '';
        data.map(item => WordService.getAggregatedWord(item.id).then(newdata => {
            console.log(newdata)
            final_count = Number(newdata.userWord.optional.mistakeCount) + Number(newdata.userWord.optional.progressCount);
            create_one_cell(item._id, item.audio, item.image, item.word, item.transcription, item.wordTranslate, final_count) 
        }
        )
        )
    };

    function create_unusual_table(data) {
        tBody.innerHTML = '';
        data.map( item => create_one_unusual_cell(item._id, item.audio, item.image, item.word, item.transcription, item.wordTranslate))
    }

    function create_current_words_table(data) {  
        tBody.innerHTML = '';
        data.map(item => 
            create_one_cell(item._id, item.audio, item.image, item.word, item.transcription, item.wordTranslate, final_count) 
        )
    }

    // function recover(wordId) {
    //     WordService.updateUserWord(wordId, 'normal', {category: 'learned'})
    //     // WordService.updateUserWord(input.dataset.wordId, 'hard', { category: 'difficult' })
    // }

    function create_one_cell(id, audio, image, word, transcription, wordTranslate, total) {
        tBody.innerHTML += `<tr id="${id}">
        <td><img src='https://i.ibb.co/FxW8BS6/321.png' class='small_icon' data-audio='${base}${audio}'></td>
        <td><img src='${base}${image}' class='small_img'></td>
        <td>${word}</td>
        <td>${transcription}</td>
        <td>${wordTranslate}</td>
        <td>${total}</td>
      </tr>`
    }

    function create_one_unusual_cell(id, audio, image, word, transcription, wordTranslate) {
        tBody.innerHTML += `<tr id="${id}">
        <td><img src='https://i.ibb.co/FxW8BS6/321.png' class='small_icon' data-audio='${base}${audio}'></td>
        <td><img src='${base}${image}' class='small_img'></td>
        <td>${word}</td>
        <td>${transcription}</td>
        <td>${wordTranslate}</td>
        <td><button type="button" class="btn btn-danger" id="filter_recover_word" data-word='${id}'>Восстановить</button></td>
      </tr>`
    }

    tBody.addEventListener('click', () => {
        const element = event.target.closest('button');
        console.log()
        if (element == null){
            return
        }
        console.log('tut')
        // recover(element.dataset.word);
        element.parentElement.parentElement.style.display = 'none';

    })

    function filter_by_a_search() {
        let input = document.getElementById('search_string');
        let filter = input.value.toUpperCase();
        let a
        let i
        input = document.getElementById('search_string');
        filter = input.value.toUpperCase();
        const tr = tBody.getElementsByTagName('tr');

        for (i = 0; i < tr.length; i++) {
            a = tr[i];
            if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }

    document.getElementById('search_string').addEventListener('keyup', filter_by_a_search);

    function play_audio(url) {
        new Audio(url).play();
    }

    main.addEventListener('click', () =>{
        const element = event.target.closest('img');
        if (element == null){
            return;
        }
        play_audio(element.dataset.audio);
    })

    function sort_table_by_column(table, column, asc = true) {
        const dirMod = asc ? 1 : -1;
        const rows = Array.from(tBody.querySelectorAll('tr'));
        const sorted_rows = rows.sort((a, b) => {
            const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
            const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
    
            return aColText > bColText ? (1 * dirMod) : (-1 * dirMod)
        })
    
        tBody.append(... sorted_rows)
    
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
    })

    document.getElementById('filter_learn').addEventListener('click', () => {
        WordService.getWordsByCategory('learned').then(data => {
            create_current_words_table(data)
        });
    })

    document.getElementById('filter_hard').addEventListener('click', () => {
        WordService.getWordsByCategory('difficult').then(data => {
            create_unusual_table(data)
        });
    })

    document.getElementById('filter_delete').addEventListener('click', () => {
        WordService.getWordsByCategory('deleted').then(data => {
            create_unusual_table(data)
        });
    })
}