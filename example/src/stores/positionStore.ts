import { defineStore } from '../../../src/index';

export default defineStore({
  state: {
    pos: [0, 0],
  },
  options: {
    persistent: true,
    storageKey: 'solid-demo-pos',
    storageThrottle: 500, // this will only write in localStorage every 500 ms
  },
  actions: (state, set) => ({
    move: (pos) => {
      set('pos', pos);
    },
  }),
});
