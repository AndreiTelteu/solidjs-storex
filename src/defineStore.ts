import { createStore, Store } from 'solid-js/store';
import { StoreOptions, DefineStoreProps, StoreActionObject } from './types';

const DEFAULT_OPTIONS: StoreOptions = {
  persistent: true,
  storageThrottle: false,
  storageKey: 'storex-state',
};

export function defineStore<T extends object, U extends StoreActionObject>({
  state = {} as T,
  actions: storeActions,
  options = {},
}: DefineStoreProps<T, U>) {
  // export function defineStore<T extends object = {}>({ state, actions: storeActions, reducer }: DefineStoreProps<T>) {
  return (): [get: Store<T>, actions: U] => {
    options = { ...DEFAULT_OPTIONS, ...options };
    let initState = state;
    if (options.persistent) {
      try {
        const stateString: T = JSON.parse(window?.localStorage?.getItem?.(options.storageKey) || '{}');
        if (stateString) initState = { ...initState, ...stateString };
      } catch (e) {}
    }
    // const [store, setStore] = createStore<T>(initState as Store<T extends object ? any : any>);
    // const [store, setStore] = createStore(initState as Store<T>);
    // const [store, setStore] = createStore<T>(initState);
    const [store, setStore] = createStore(initState);
    const actions: StoreActionObject = {};
    Object.entries(storeActions(store, setStore)).forEach(([key, action]) => {
      actions[key] = (...attrs) => {
        // reducer(store, action(...attrs), setStore);
        action(...attrs);
        save(store, options);
      };
    });
    return [store as T, actions as U];
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
  window?.localStorage?.setItem?.(options.storageKey, JSON.stringify(state));
};
