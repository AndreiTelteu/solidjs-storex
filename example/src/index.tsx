/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';

render(
  () => (
    <>
      <App />
      <App />
    </>
  ),
  document.getElementById('root') as HTMLElement,
);
