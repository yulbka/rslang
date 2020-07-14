import { WordService } from '../../../scripts/service/Word.Service';

let ArrWord = [];

// export async function loadAllWords() {
// 	ArrWord = await WordService.getWordsForGames(20);
// }
export async function loadAllWords() {
  ArrWord = await WordService.getWordsByLevelAndPage();
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

  const gE = (el) => {
    return document.getElementById(el);
  };

  const RandomInteger = (p1) => {
    return Math.floor(Math.random() * p1);
  };

  const LoadWords = (p1) => {
    EngWord = ArrWord[p1].word;
    RusWord = ArrWord[p1].wordTranslate;
    RandomWord = ArrWord[RandomInteger(9)].wordTranslate;

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
		  correctAnswer += 10 + 10 * Math.trunc(successInRow / 4)
          gE('score').innerText = correctAnswer;
		} else {
			successInRow = 0
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
			correctAnswer += 10 + 10 * Math.trunc(successInRow / 4)

          if (gE('score')) {
            gE('score').innerText = correctAnswer;
          }
        } else {
			successInRow = 0
		}
        count++;

        if (count_time === 0) {
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
