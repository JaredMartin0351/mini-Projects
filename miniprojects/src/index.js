import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';

Modal.setAppElement('#root');

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>{' '}
  </React.StrictMode>,
  document.getElementById('root')
);
