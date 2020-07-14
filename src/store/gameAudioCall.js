import {WordService} from "scripts/service/Word.Service";
import { getRandomInt} from "utils";

export const audiocallGameSettings = {
    currentGame: {
        currentWord: 0,
        maxWordsLength: 3,
        variants: 5,
        statistics: {
            learned: new Map(),
            errors: new Map(),
        },
    },
    get currentLevel() {
        return localStorage.getItem('levelAudiocallGame') ? +localStorage.getItem('levelAudiocallGame') : 1;
    },
    wordsMap: new Map(),
    similarWordsMAp: new Map(),
    get wordsArray() {
        return Array.from(this.wordsMap.values()).filter(({ level }) => level === this.currentLevel);
    },
    async getWords() {
        const { count: amountWordsByLevel } = await WordService.getAmountUserWords({ group: this.currentLevel });
        const pageSize = 20;
        const words = await WordService.getWordsByLevelAndPage(
            this.currentLevel,
            getRandomInt(amountWordsByLevel / pageSize)
        );
        words.forEach((gameWord) =>
            this.wordsMap.set(gameWord.word, {
                wordId: gameWord.id,
                word: gameWord.word,
                audio: gameWord.audio,
                image: gameWord.image,
                wordTranslate: gameWord.wordTranslate,
                level: gameWord.group,
            })
        );
    }
};



