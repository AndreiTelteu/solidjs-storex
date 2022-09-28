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

export interface StoreWatchFunction<T, W> {
  (value: any, store: T | Store<T>, set: SetStoreFunction<T>): W;
}
export interface StoreWatch<T, W> {
  [key: string]: StoreWatchFunction<T, W>;
}

export interface DefineStoreProps<T, U extends StoreActionObject, W> {
  state: T | Store<T>;
  actions?: StoreActions<T, U>;
  watch?: StoreWatch<T, W>;
  options?: StoreOptions;
}

export interface StoreReducer<T> {
  (state: T, action: any, set: SetStoreFunction<T>): void;
}
