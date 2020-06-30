import { requestCreator } from '../utils/requests';
// import { store } from '../store/index';

export class Statistics {
  static async get() {
    const statistics = await requestCreator({
      url: `/users/${localStorage.getItem('userId')}/statistics`,
      method: requestCreator.methods.get
    });
    console.log(statistics);
    return statistics;
  }

  static async set(statData) {
    const statistics = await requestCreator({
      url: `/users/${localStorage.getItem('userId')}/statistics`,
      method: requestCreator.methods.put,
      data: statData
    });
    console.log(statistics);
    return statistics;
  }
}