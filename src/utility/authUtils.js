import { auth } from '../firebase';

export const getCurrentUser = () => {
  return auth.currentUser;
};
