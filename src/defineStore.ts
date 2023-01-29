import { batch, createEffect, createReaction, createRenderEffect, on, untrack } from 'solid-js';
import { createStore, Store } from 'solid-js/store';
import { StoreOptions, DefineStoreProps, StoreActionObject } from './types';

const DEFAULT_OPTIONS: StoreOptions = {
  persistent: true,
  storageThrottle: false,
  storageKey: 'storex-state',
};

export function defineStore<T extends object, U extends StoreActionObject, W>({
  state = {} as T,
  actions: storeActions,
  watch = null,
  options = {},
}: DefineStoreProps<T, U, W>) {
  const initStore = (): [get: Store<T>, actions: U] => {
    options = { ...DEFAULT_OPTIONS, ...options };
    let initState = state;
    if (options.persistent) {
      try {
        const stateString: T = JSON.parse(window?.localStorage?.getItem?.(options.storageKey) || '{}');
        if (stateString) initState = { ...initState, ...stateString };
      } catch (e) {}
    }
    const [store, setStore] = createStore(initState);
    const actions: StoreActionObject = {};
    Object.entries(storeActions(store, setStore)).forEach(([key, action]) => {
      actions[key] = async (...attrs) => {
        const actionResult = await Promise.resolve(action(...attrs));
        save(store, options);
        return actionResult;
      };
    });
    if (typeof watch != 'undefined' && watch != null) {
      try {
        Object.entries(watch).forEach(([watchKey, effect]) => {
          const tracked = () => store[watchKey];
          createRenderEffect(
            on(tracked, () => {
              effect(tracked(), store, setStore);
            }),
          );

          // other methods to watch on a store
          // createEffect(() => {
          //   console.log('state watchhh', store[watchKey]);
          //   untrack(() => {
          //     effect(tracked(), store, setStore);
          //   });
          // });

          // const track = createReaction(() => {
          //   console.log('reaction', { watchKey });
          //   effect(tracked(), store, setStore);
          // });
          // track(() => tracked());
          // track(() => store[watchKey]);
        });
      } catch (e) {}
    }
    return [store as T, actions as U];
  };
  const storedStore = initStore();
  return () => storedStore;
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
