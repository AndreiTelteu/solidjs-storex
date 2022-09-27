import { createStore, Store } from 'solid-js/store';
import { StoreOptions, DefineStoreProps } from './types';

const DEFAULT_OPTIONS: StoreOptions = {
  persistent: true,
  storageThrottle: false,
};

export function defineStore<T extends object = {}>({ state, actions: storeActions }: DefineStoreProps<T>) {
  // export function defineStore<T extends object = {}>({ state, actions: storeActions, reducer }: DefineStoreProps<T>) {
  return (options: StoreOptions = {}): [get: Store<T>, actions: any] => {
    options = { ...DEFAULT_OPTIONS, ...options };
    let initState = state;
    if (options.persistent) {
      try {
        const stateString: T = JSON.parse(window?.localStorage?.getItem?.('windows-state') || '{}');
        if (stateString) initState = { ...initState, ...stateString };
      } catch (e) {}
    }
    // const [store, setStore] = createStore<T>(initState as Store<T extends object ? any : any>);
    // const [store, setStore] = createStore(initState as Store<T>);
    // const [store, setStore] = createStore<T>(initState);
    const [store, setStore] = createStore(initState);
    const actions = {};
    Object.entries(storeActions(store, setStore)).forEach(([key, action]) => {
      actions[key] = (...attrs) => {
        // reducer(store, action(...attrs), setStore);
        action(store, attrs, setStore);
        save(store, options);
      };
    });
    return [store as T, actions];
  };
}

let storageTimeout, storageTimeout2;
const save = <T>(state: Store<T>, options: StoreOptions) => {
  if (options.persistent) {
    if (options.storageThrottle) {
      if (storageTimeout) {
        clearTimeout(storageTimeout);
        storageTimeout = null;
      }
      storageTimeout = setTimeout(() => {
        saveLocalStorage(state, options);
      }, options.storageThrottle);

      // second timeout will exec every x ms
      if (storageTimeout2) return;
      storageTimeout2 = setTimeout(() => {
        saveLocalStorage(state, options);
        if (storageTimeout2) {
          clearTimeout(storageTimeout2);
          storageTimeout2 = null;
        }
      }, options.storageThrottle);
    } else {
      saveLocalStorage(state, options);
    }
  }
  return state;
};

const saveLocalStorage = <T>(state: Store<T>, options: StoreOptions) => {
  window?.localStorage?.setItem?.('windows-state', JSON.stringify(state));
};
