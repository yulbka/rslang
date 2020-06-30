import { router } from '../routes/index';

//const API_HOST = 'https://afternoon-falls-25894.herokuapp.com';

const API_HOST = 'http://pacific-castle-12388.herokuapp.com';

/*
 (required) url: part after host
 (required) method: one of requestCreator.methods
 data: if method 'get', it transform to searchParams in url, else - add to 'body' of request
*/
export async function requestCreator(settings) {
  try {
    let url = `${API_HOST}${settings.url}`;
    let body;

    if (!Object.values(requestCreator.methods).includes(settings.method)) throw `${settings.method} is unknown method`;

    switch (settings.method) {
      case requestCreator.methods.get: {
        if (settings.data) {
          const searhParams = getSearchParams({ params: settings.data });
          url += `/?${searhParams}`;
        }
        break;
      }

      case requestCreator.methods.post:
      case requestCreator.methods.put: {
        body = JSON.stringify(settings.data);
        break;
      }

      default:
        break;
    }

    //TODO: need to use separate field in localStorage for all data our application
    const token = localStorage.getItem('token');
    const headers = new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    if (token) headers.append('Authorization', `Bearer ${token}`);

    const response = await fetch(url, {
      method: settings.method,
      headers,
      withCredentials: true,
      body,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        router.navigate('login');
      } else {
        throw Error(response.status);
      }
    }

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
  put: 'PUT',
  delete: 'DELETE',
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
