import { createSignal, Signal } from 'solid-js';

export interface UseStateRef<T> {
  [key: string | number]: Signal<T>;
}

export function useState<T>(initialState: T): T {
  const stateRef: UseStateRef<T> = {};
  Object.entries(initialState).forEach((item) => {
    stateRef[item[0] as string] = createSignal(item[1]);
  });
  const state = new Proxy(
    {},
    {
      get(target, key) {
        return stateRef?.[key as string]?.[0]?.() as T;
      },
      set(target, key, value) {
        stateRef?.[key as string]?.[1]?.(value);
        return true;
      },
    },
  );
  return state as T;
}
