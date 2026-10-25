import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Filter deprecated THREE.Clock warning emitted by upstream libraries (@react-three/fiber)
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('THREE.Clock: This module has been deprecated')
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

createRoot(document.getElementById('root')!).render(<App />);
