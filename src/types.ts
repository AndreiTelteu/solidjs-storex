import type { SetStoreFunction } from 'solid-js/store';

export type Store<T> = T;

export interface StoreOptions {
  persistent?: boolean;
  storageThrottle?: false | number;
}

export interface StoreActionFunction {
  (...props: any): void;
}

export interface StoreActions<T> {
  (store: T | Store<T>, set: SetStoreFunction<T>): { [key: string]: StoreActionFunction };
}

export interface DefineStoreProps<T> {
  state: T | Store<T>;
  actions?: StoreActions<T>;
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
