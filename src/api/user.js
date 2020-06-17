import { requestCreator } from '../utils/requests';

export const API_USER = {
  async getUser({ userId }) {
    try {
      return await requestCreator({
        url: `/users/${userId}`,
        method: requestCreator.methods.get,
      });
    } catch (error) {
      if (error.message === 'User non exist') {
        console.log('error: User non exist');
      } else {
        /*show alert(error) */
      }
    }
  },
};
