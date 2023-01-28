# solidjs-storex

A simple helper to organize state management actions and default state with createStore.

Demo here: https://codesandbox.io/s/9kofl0?file=/src/App.tsx

This plugin is **not** meant to improve performance or introduce a new state management library. His only purpose is to help organize one or more global createStore's in your app.

```jsx
import { defineStore } from 'solidjs-storex';
export default defineStore({
  state: {
    auth: {
      user: {
        email: ''
      }
    },
  },
  actions: (state, set) => ({
    changeEmail: (newEmail) => {
      set('auth', 'user', 'email', newEmail);
    },
  }),
};
```

Another helper in this library is `useState` which allows you to use signals just like an plain old boring object.

```jsx
// it turns this boilerplate:
const [username, setUsername] = createSignal('');
const [firstName, setFirstName] = createSignal('');
const [lastName, setLastName] = createSignal('');
const [email, setEmail] = createSignal('');
const [password, setPassword] = createSignal('');
const [repeatPassword, setRepeatPassword] = createSignal('');

// into this:
import { useState } from 'solidjs-storex';
const state = useState({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  repeatPassword: '',
});
```

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
import { useState } from 'solidjs-storex';

export default function App(): JSX.Element {
  const [user, actions] = userStore();
  const state = useState({
    username: '',
    // useState is just a proxy to createSignal
    // I find it more intuitive to change state with an assignment expression
    // and it looks a lot like VueJS
  });

  return (
    <div>
      <p>{user.logged ? `Logged in as: ${user.user?.username}` : 'Not logged in'}</p>
      {JSON.stringify(user)}
      <Show
        when={user.logged == false}
        children={() => (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              actions.login({ username: state.username }, { accessToken: 'abcs' });
              state.username = '';
            }}
          >
            <input
              value={state.username}
              onInput={(event) => {
                state.username = (event.target as HTMLInputElement).value;
              }}
              required
            />
            <button type="submit">Login</button>
          </form>
        )}
        fallback={() => (
          <div>
            <button type="button" onClick={() => actions.logout()}>
              Logout
            </button>
            <button type="button" onClick={() => actions.deleteToken()}>
              Delete token
            </button>
          </div>
        )}
      />
    </div>
  );
}
```

`stores/userStore.ts`

```tsx
import { defineStore } from 'solidjs-storex';
import { produce } from 'solid-js/store';

export default defineStore({
  state: {
    logged: false,
    user: null,
    token: null,
  },
  options: {
    persistent: true,
    storageKey: 'solid-app-user',
  },
  actions: (state, set) => ({
    login: (user, token) => {
      set((state) => ({
        ...state,
        logged: true,
        user,
        token,
      }));
    },
    logout: () => {
      set((state) => ({
        ...state,
        logged: false,
        user: null,
        token: null,
      }));
    },
    changeUsername: (newUsername) => {
      // this is super easy to edit a nested object
      set('user', 'username', newUsername);
      // you can use any setState method you want from the docs:
      // https://www.solidjs.com/docs/latest/api#updating-stores
    },
    deleteToken: () => {
      // when you delete stuff I found that you should call produce in order to trigger effects
      set(
        produce((state) => {
          delete state.token;
          return state;
        }),
      );
    },
  }),
});
```

## Changelog:

### v1.0.3

- Before this version, each call on the result of `defineStore` did create a new independent `createStore`, with results in different store values on every component. After this update it now correctly returns the same initiated store.
- Update dependencies

### v1.0.2

- Added watch api to create effects when a state changes. Checkout `example/src/stores/userStore.ts`.

### v1.0.1

- Update demo link

### v1.0.0

- Initial release
