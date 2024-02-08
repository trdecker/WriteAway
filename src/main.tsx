import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Storage } from '@ionic/storage';

const store = new Storage()
store.create()

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);