import { defineStore } from 'solidjs-storex';
import { produce } from 'solid-js/store';
import userActivityStore from './userActivityStore';
import { untrack } from 'solid-js';

const [userActivity, { add: addEvent }] = userActivityStore();

export default defineStore({
  state: {
    logged: false,
    user: null,
    token: null,
    prevUser: null,
  },
  options: {
    persistent: true,
    storageKey: 'solid-app-user',
  },
  watch: {
    user: (value, state, set) => {
      if (value) set('prevUser', value?.username);

      // calling an action from another store does not work. i don't know why
      addEvent(value ? 'User logged in as: ' + value?.username : 'User not logged in');
    },
  },
  actions: (state, set) => ({
    login: async (username) => {
      let { user, token } = await fakeLoginApi(username);
      set((state) => ({
        ...state,
        logged: true,
        user,
        token,
      }));
      return user;
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
});

const fakeLoginApi = (username: string): Promise<{ user: { username: string }; token: { accessToken: string } }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: { username },
        token: { accessToken: 'abcs' },
      });
    }, 1000);
  });
};
