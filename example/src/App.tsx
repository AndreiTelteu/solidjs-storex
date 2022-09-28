import { For, JSX, Show } from 'solid-js';
import { useState } from '../../src/index';
import userStore from './stores/userStore';
import positionStore from './stores/positionStore';
import userActivityStore from './stores/userActivityStore';

export default function App(): JSX.Element {
  const [user, actions] = userStore();
  const [positionState, positionActions] = positionStore();
  const [userActivityState, { add: addEvent, clear: clearEvents }] = userActivityStore();
  const state = useState({
    username: '',
  });

  return (
    <div
      style="width: 100vw; height: 100vh; position: absolute; top: 0; left: 0;"
      onMouseMove={(event) => {
        positionActions.move([event.clientX, event.clientY]);
      }}
    >
      <p>{user.logged ? `Logged in as: ${user.user?.username}` : 'Not logged in'}</p>
      <p>
        <b>useState</b> = <code>{JSON.stringify(user)}</code>
      </p>
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
              autofocus
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
      <p>
        <b>positionStore</b> = <code>{JSON.stringify(positionState)}</code>
      </p>
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
      <p>
        <b>userActivityStore</b> : length = <code>{JSON.stringify(userActivityState.events.length)}</code>
        &nbsp; &nbsp; &nbsp; &nbsp;
        <button type="button" onClick={() => clearEvents()}>
          Clear
        </button>
      </p>
      <For each={userActivityState.events} children={(item) => <div>{item}</div>} />
    </div>
  );
}
