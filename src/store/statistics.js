export const statistics = {
  learnedWords: 0,
  mainGame: {
    short: {
      cards: 0,
      newWords: 0,
      answers: '',
    },
    long: {
      [new Date().toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' })]: {
        cards: 0,
        newWords: 0,
        mistakes: 0,
      },
    },
  },
  englishPuzzle: {
    short: null,
    long: null,
  }
}