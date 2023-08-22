import { For, JSX, Show } from 'solid-js';
import { useState } from 'solidjs-storex/state';
import userStore from './stores/userStore';
import positionStore from './stores/positionStore';
import userActivityStore from './stores/userActivityStore';

export default function App(): JSX.Element {
  const [user, actions] = userStore();
  const [positionState, positionActions] = positionStore();
  const [userActivityState, { add: addEvent, clear: clearEvents }] = userActivityStore();
  const state = useState({
    username: '',
    loading: false,
  });

  let mainTarget;
  return (
    <div
      ref={mainTarget}
      style="position: relative; margin-bottom: 100px;"
      onMouseMove={(event) => {
        let bounds = mainTarget?.getBoundingClientRect();
        positionActions.move([event.clientX - bounds?.left, event.clientY - bounds?.top]);
      }}
    >
      <p>{user.logged ? `Logged in as: ${user.user?.username}` : 'Not logged in'}</p>
      <p>
        <b>useState</b> = <code>{JSON.stringify(user)}</code>
      </p>
      <Show
        when={user.logged == false}
        fallback={
          <div>
            <button type="button" onClick={() => actions.logout()}>
              Logout
            </button>
            <button type="button" onClick={() => actions.deleteToken()}>
              Delete token
            </button>
          </div>
        }
      >
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            state.loading = true;
            const loginRes = await actions.login(state.username);
            console.log('This is async as well. Welcome:', loginRes.username);
            state.username = '';
            state.loading = false;
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
          {state.loading && ' - Loading...'}
        </form>
      </Show>
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
