export class HttpService {
  static async get(url) {
    const options = {
      method: 'GET',
      withCredentials: true,
      headers: HttpService.createHeaders(),
    };
    const result = await HttpService.request(url, options);
    return result;
  }

  static async post(url, data) {
    const options = {
      method: 'POST',
      withCredentials: true,
      headers: HttpService.createHeaders(),
      body: JSON.stringify(data),
    };
    const result = await HttpService.request(url, options);
    return result;
  }

  static async put(url, data) {
    const options = {
      method: 'PUT',
      withCredentials: true,
      headers: HttpService.createHeaders(),
      body: JSON.stringify(data),
    };
    const result = await HttpService.request(url, options);
    return result;
  }

  static async request(url, options) {
    try {
      const res = await fetch(url, options);
      if (res.status === '401') {
        localStorage.removeItem('token');
        // add transition to authorization page
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  static createHeaders() {
    const myHeaders = new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    const token = localStorage.getItem('token');
    if (token) myHeaders.append('Authorization', `Bearer ${token}`);
    return myHeaders;
  }
}
