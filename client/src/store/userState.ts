import { User } from '@src/@types/User_types';
import { atom } from 'recoil';

const initUsers = [
  {
    nickName: '',
    userAvatar: '',
    socketId: '',
  },
];

const initUser = {
  nickName: '',
  userAvatar: '',
  socketId: '',
};

export const usersState = atom<User[]>({
  key: 'usersState',
  default: [],
});

export const userState = atom<User>({
  key: 'userState',
  default: initUser,
});

export const loginUserState = atom<User>({
  key: 'loginUserState',
  default: initUser,
});
