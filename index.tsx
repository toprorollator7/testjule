import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from '@workos-inc/authkit-react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider
      clientId={import.meta.env.VITE_WORKOS_CLIENT_ID}
      domain={import.meta.env.VITE_WORKOS_DOMAIN}
      redirectUri={window.location.origin}
    >
      <App />
    </AuthProvider>
  </React.StrictMode>
);
