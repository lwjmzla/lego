
import { Module } from 'vuex';
import { GlobalDataProps } from './index';

export interface UserProps {
  isLogin: boolean;
  userName: string;
}

const user: Module<UserProps, GlobalDataProps> = {
  state: {
    isLogin: false,
    userName: ''
  },
  mutations: {
    login (state, userName: string) {
      state.isLogin = true;
      state.userName = userName;
    },
    logout (state) {
      state.isLogin = false;
      state.userName = '';
    }
  }
};

export default user;
