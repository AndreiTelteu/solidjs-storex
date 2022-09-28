import { produce } from 'solid-js/store';
import { defineStore } from '../../../src/index';

export default defineStore({
  state: {
    events: [],
  },
  options: {
    persistent: true,
    storageKey: 'solid-user-activity',
  },
  actions: (state, set) => ({
    add: (text) => {
      set(
        produce((state) => {
          state.events.push(text);
          return state;
        }),
      );
    },
    clear: () => {
      set(
        produce((state) => {
          state.events = [];
          return state;
        }),
      );
    },
  }),
});
