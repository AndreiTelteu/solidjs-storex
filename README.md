# solidjs-storex

A simple helper to organize state management actions and default state in a redux-like store.

Demo here: https://codesandbox.io/s/solidjs-redux-like-store-with-localstorage-4y7v6d?file=/src/store/windowStore.jsx

## Install

```bash
npm install solidjs-storex
```

```bash
yarn add solidjs-storex
```

## Usage example

`App.tsx`

```tsx
import { JSX } from 'solid-js';
import userStore from './stores/userStore';

export default function App(): JSX.Element {
  const [user, actions] = userStore({
    persistent: true,
  });

  return (
    <div>
      <p>{user.logged ? `Logged in as: ${user.user?.name}` : 'Not logged in'}</p>
    </div>
  );
}
```

`stores/userStore.ts`

```tsx
import { defineStore } from 'solidjs-storex';

export default defineStore({
  state: {
    logged: false,
    user: null,
    token: null,
  },
  actions: {
    login: (user, token) => ({ type: 'LOGIN', user, token }),
    logout: () => ({ type: 'LOGOUT' }),
  },
  reducer: (state, action, set) => {
    switch (action.type) {
      case 'LOGIN':
        const { user, token } = action;
        set((state) => ({
          ...state,
          logged: true,
          user,
          token,
        }));
        break;
      case 'LOGOUT':
        set((state) => ({
          ...state,
          logged: false,
          user: null,
          token: null,
        }));
        break;
      default:
        break;
    }
  },
});
```
