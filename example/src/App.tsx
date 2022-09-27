import { JSX, createSignal } from 'solid-js';
import userStore from './stores/userStore';

export default function App(): JSX.Element {
  const [user, actions] = userStore({
    persistent: true,
  });
  // const [username]

  return (
    <div>
      <p>{user.logged ? `Logged in as: ${user.user?.username}` : 'Not logged in'}</p>
      <input onInput={(event) => {actions.
        
      }} />
    </div>
  );
}
