import { APP_CONFIG } from '@/src/config';
import { getDocument } from '@/src/services/apiService';
import { User } from '@/src/types/user';

export const userService = {
  async getById(userId: string): Promise<User> {
    try {
      const user = await getDocument(
        APP_CONFIG.USERS_COLLECTION,
        userId
      );
      return user as unknown as User;
    } catch (error) {
      console.error('get user by id error', error);
      throw error;
    }
  },
};

