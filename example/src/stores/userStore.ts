import { defineStore } from '../../../src/index';

export default defineStore({
  state: {
    logged: false,
    user: null,
    token: null,
  },
  options: {
    persistent: true,
    storageKey: 'solid-app-user',
  },
  actions: (state, set) => ({
    login: (user, token) => {
      set((state) => ({
        ...state,
        logged: true,
        user,
        token,
      }));
    },
    logout: () => {
      set((state) => ({
        ...state,
        logged: false,
        user: null,
        token: null,
      }));
    },
  }),
  // i tried this patters. seems to much boilerplate with the type attr and switch
  // actions: {
  //   login: (user, token) => ({ type: 'LOGIN', user, token }),
  //   logout: () => ({ type: 'LOGOUT' }),
  // },
  // reducer: (state, action, set) => {
  //   switch (action.type) {
  //     case 'LOGIN':
  //       const { user, token } = action;
  //       set((state) => ({
  //         ...state,
  //         logged: true,
  //         user,
  //         token,
  //       }));
  //       break;
  //     case 'LOGOUT':
  //       set((state) => ({
  //         ...state,
  //         logged: false,
  //         user: null,
  //         token: null,
  //       }));
  //       break;
  //     default:
  //       break;
  //   }
  // },
});
