import { requestCreator } from '../utils/requests';

export const API_USER = {
  async getUser({ userId }) {
    try {
      return await requestCreator({
        url: `/users/${userId}`,
        method: requestCreator.methods.get,
      });
    } catch (error) {
      if (error.message === '404') {
        console.log('error: User non exist');
      } else {
        /*show alert(error) */
      }
    }
  },
  async setUserSettings({ userId, userSettings }) {
    try {
      return await requestCreator({
        url: `/users/${userId}/settings`,
        method: requestCreator.methods.put,
        data: userSettings,
      });
    } catch (error) {
      console.error(error);
    }
  },
  async getUserSettings({ userId }) {
    try {
      const { optional, id, ...restResult } = await requestCreator({
        url: `/users/${userId}/settings`,
        method: requestCreator.methods.get,
      });
      return {
        ...restResult,
        ...optional,
      };
    } catch (error) {
      console.error(error);
    }
  },
};
