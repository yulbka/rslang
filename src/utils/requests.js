const API_HOST = 'https://afternoon-falls-25894.herokuapp.com';

/*
 (required) url: part after host
 (required) method: one of requestCreator.methods
 data: if method 'get', it transform to searchParams in url, else - add to 'body' of request
*/
export async function requestCreator(settings) {
  try {
    let url = `${API_HOST}${settings.url}`;
    let body;

    switch (settings.method) {
      case requestCreator.methods.get: {
        if (settings.data) {
          const searhParams = getSearchParams({ params: settings.data });
          url += `/?${searhParams}`;
        }
        break;
      }

      case requestCreator.methods.post: {
        body = JSON.stringify(settings.data);
        break;
      }

      default:
        throw `${settings.method} is unknown method`;
    }

    const token = localStorage.getItem('token');

    const headers = new Headers({
      Authorization: token ? `Bearer ${token}` : undefined,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });

    const response = await fetch(url, {
      method: settings.method,
      headers,
      withCredentials: true,
      body,
    });

    if (!response.ok) throw Error('Something went wrong');

    const result = await response.json();
    return result;
  } catch (error) {
    if (error === '1') {
      console.log('error1');
    } else if (error === '2') {
      console.log('error2');
    } else {
      throw error;
    }
  }
}

requestCreator.methods = {
  get: 'GET',
  post: 'POST',
};

function getSearchParams({ initValue, apiParamsMap, params }) {
  return Object.keys(params).reduce((acc, paramKey) => {
    const paramValue = params[paramKey];
    if (paramValue) {
      acc.append(apiParamsMap?.[paramKey] ?? paramKey, paramValue);
    }
    return acc;
  }, new URLSearchParams(initValue));
}
