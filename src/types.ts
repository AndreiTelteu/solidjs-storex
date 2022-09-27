import type { Signal } from 'solid-js';
import type { SetStoreFunction } from 'solid-js/store';

export interface UseStateRef<T> {
  [key: string | number]: Signal<T>;
}

export type Store<T> = T;

export interface StoreOptions {
  persistent?: boolean;
  storageKey?: string;
  storageThrottle?: false | number;
}

export interface StoreActionFunction {
  (...props: any): void;
}
export interface StoreActionObject {
  [key: string]: StoreActionFunction;
}

export interface StoreActions<T, U> {
  (store: T | Store<T>, set: SetStoreFunction<T>): U;
}

export interface DefineStoreProps<T, U extends StoreActionObject> {
  state: T | Store<T>;
  actions?: StoreActions<T, U>;
  options?: StoreOptions;
  // reducer?: StoreReducer<T>;
}
// export interface StoreActions {
//   [key: string]: StoreActionFunction;
// }
// export interface StoreActionFunction {
//   (...props: any): { type: string; [key: string | number]: any };
// }

export interface StoreReducer<T> {
  (state: T, action: any, set: SetStoreFunction<T>): void;
}
