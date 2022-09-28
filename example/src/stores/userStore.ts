import { defineStore } from '../../../src/index';
import { produce } from 'solid-js/store';

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
    changeUsername: (newUsername) => {
      // this is super easy to edit a nested object
      set('user', 'username', newUsername);
      // you can use any setState method you want from the docs:
      // https://www.solidjs.com/docs/latest/api#updating-stores
    },
    deleteToken: () => {
      // when you delete stuff I found that you should call produce in order to trigger effects
      set(
        produce((state) => {
          delete state.token;
          return state;
        }),
      );
    },
  }),

  // I tried this pattern. seems to much boilerplate with the type attr and switch
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
