const getWords = async (page, level) => {
  try {
    const url = `https://afternoon-falls-25894.herokuapp.com/words?page=${page}&group=${level}`;
    const res = await fetch(url);
    const json = await res.json();
    return json;
  } catch (e) {
    return console.log(e);
  }
};

const getTranslations = async (engWord) => {
  try {
    const API_KEY = 'trnsl.1.1.20200505T195924Z.79d3216cb13d4492.04e1374ed67de7952079ad2e8b3ddcd211080d02';
    const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${API_KEY}&text=${engWord}&lang=en-ru`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (e) {
    return console.log(e);
  }
};

export { getWords, getTranslations };
