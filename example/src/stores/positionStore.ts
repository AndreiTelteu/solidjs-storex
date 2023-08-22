import { defineStore } from 'solidjs-storex';

// this is how you would define custom type for every state if you need
// this is optional
type PositionState = {
  pos: [number, number] | null;
};

export default defineStore({
  state: {
    pos: [0, 0],
  } as PositionState,

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
