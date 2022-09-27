import { JSX, Show } from 'solid-js';
import { useState } from '../../src/index';
import userStore from './stores/userStore';
import positionStore from './stores/positionStore';

export default function App(): JSX.Element {
  const [user, actions] = userStore();
  const [positionState, positionActions] = positionStore();
  const state = useState({
    username: '',
  });

  return (
    <div
      style="width: 100vw; height: 100vh;"
      onMouseMove={(event) => {
        positionActions.move([event.clientX, event.clientY]);
      }}
    >
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
          </div>
        )}
      />
      <div
        style={{
          position: 'absolute',
          left: positionState.pos[0] + 'px',
          top: positionState.pos[1] + 'px',
          width: '18px',
          height: '18px',
          background: 'yellow',
          'border-radius': '100%',
          transform: 'translate3D(-50%, -50%, 0) scale(2)',
          opacity: 0.6,
          'pointer-events': 'none',
        }}
      />
    </div>
  );
}
