/*const userExample = {
    "email": "string3242424@dfgdg.dg",
    "password": "ASD324sdfs3@$@",
    "userId": "5eea492edffad00017faa81c",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlZWE0OTJlZGZmYWQwMDAxN2ZhYTgxYyIsImlhdCI6MTU5MjQxMjc1NiwiZXhwIjoxNTkyNDI3MTU2fQ.Pl3XwXnqs9MdMOuvTIS2GKGChJcmFf548QJyzwLkzss",
}*/

export const userSettings = {
  email: null,
  password: null,
  token: null,
  userId: null,
  wordsPerDay: null,
  // ...userExample,
  words: {
    amount: null,
    default: 50,
    get amountOfNewWords() {
      return this.amount ?? this.default;
    },
  },
  cards: {
    maxAmount: null,
    default: 50,
    get amountOfNewCards() {
      return this.maxAmount ?? this.default;
    },
    informationOfCard: {
      translation: true,
      sentenceWithExplanation: false,
      sentenceWithExample: false,
      transcription: true,
      image: true,
    },
    showAnswerButton: false,
  },
  errors: {},
};
