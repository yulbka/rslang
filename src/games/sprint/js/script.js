import { WordService } from '../../../scripts/service/Word.Service';
import { getRandomNumber } from '../../../scripts/helpers/getRandomNumber';


let ArrWord = [];
export const loadAllWords = async () => {
  const ArrWordFirst = await WordService.getWordsByLevelAndPage();
  const ArrWordSecond = await WordService.getWordsByLevelAndPage();
  ArrWord = [...ArrWordFirst, ...ArrWordSecond]
}



export function startGame() {
  let count = 0;
  let correctAnswer = 0;
  let count_time = 60;
  let EndGame = false;
  let EngWord = '';
  let RusWord = '';
  let RandomWord = '';
  let successInRow = 0;
  const answerValue = document.querySelector('#answerValue');

  const gE = (el) => {
    return document.getElementById(el);
  };

  const RandomInteger = (p1) => {
    return Math.floor(Math.random() * p1);
  };

  const LoadWords = (p1) => {
    EngWord = ArrWord[p1].word;
    RusWord = ArrWord[p1].wordTranslate;
    const fiftyChance = getRandomNumber(2, 1);
    RandomWord = fiftyChance === 1 ? RusWord: ArrWord[RandomInteger(9)].wordTranslate;

    const currentWord = document.querySelector('#current-word');
    currentWord.innerHTML = EngWord;

    const currentWordTranslation = document.querySelector('#current-word-translation');
    currentWordTranslation.innerHTML = RandomWord;
  };

  LoadWords(count);

  const positiveBtn = gE('positive-button');

  if (positiveBtn) {
    positiveBtn.onclick = () => {
      if (!EndGame) {
        if (RusWord === RandomWord) {
		  successInRow++
      correctAnswer += 10 + 10 * Math.trunc(successInRow / 4);
      answerValue.innerHTML = 10 * Math.trunc(successInRow / 4);
      if(10 * Math.trunc(successInRow / 4) < 0 ) {
        answerValue.innerHTML = 10;
      }      
          gE('score').innerText = correctAnswer;
		} else {
      successInRow = 0;
      answerValue.innerHTML = 10;
		}

        count++;

        if (count_time === 0) {
          EndGame = true;
        }

        LoadWords(count);
      }
    };
  }

  const negativeBtn = gE('negative-button');
  if (negativeBtn) {
    negativeBtn.onclick = () => {
      if (!EndGame) {
        if (RusWord !== RandomWord) {
			successInRow++
      correctAnswer += 10 + 10 * Math.trunc(successInRow / 4);
      answerValue.innerHTML = 10 * Math.trunc(successInRow / 4);
      if(10 * Math.trunc(successInRow / 4) < 0 ) {
        answerValue.innerHTML = 10;
      }  
      

          if (gE('score')) {
            gE('score').innerText = correctAnswer;
          }
        } else {
      successInRow = 0;
      answerValue.innerHTML = 10;
      
		}
        count++;

        if (count_time === -1) {
          EndGame = true;
        }

        LoadWords(count);
      }
    };
  }

  const CountTime = () => {
    count_time--;
    if (gE('countdown')) {
      gE('countdown').innerText = count_time;
    }

    if (!EndGame && count_time >= 0) {
      setTimeout(() => {
        CountTime();
      }, 1000);
    }
  };

  CountTime();
}
