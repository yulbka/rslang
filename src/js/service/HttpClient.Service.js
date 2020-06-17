export class HttpService {
  static async get(url) {
    const options = {
      method: 'GET',
      headers: HttpService.createHeaders()
    };
    const result = await HttpService.request(url, options);
    return result;
  }

  static async post(url, data) {   
    const options = {
      method: 'POST',
      headers: HttpService.createHeaders(),
      body: JSON.stringify(data)
    };
    const result = await HttpService.request(url, options);
    return result;
  }

  static async put(url, data) {
    const options = {
      method: 'PUT',
      withCredentials: true,
      headers: HttpService.createHeaders(),
      body: JSON.stringify(data)
    };
    const result = await HttpService.request(url, options);
    return result;
  }

  static async request(url, options) {  
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      if (data.response.status === '401') {
        // add transition to authorization page
      }
      return data;
    }
    catch(error) {
      console.log(error);
    }
  }

  static createHeaders() {
    const token = localStorage.getItem('token');
    const myHeaders = new Headers({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
    return myHeaders;
  }
}