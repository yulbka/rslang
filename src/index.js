import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './css/index.scss';
import { App } from './scripts/App';
import { WordService } from './scripts/service/Word.Service';

App.reRender('learn');

WordService.getAllUserWords();

WordService.createUserWord('5e9f5ee35eb9e72bc21af4a1', 'easy', 'learned', '30.06.2020', '0', '1');