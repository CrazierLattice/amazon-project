import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import StoreProvider from './Store';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

createRoot(document.getElementById('root')).render(
  <StoreProvider>
    <HelmetProvider>
      <PayPalScriptProvider deferLoading={true}>
        <App />
      </PayPalScriptProvider>
    </HelmetProvider>
  </StoreProvider>
);

// reportWebVitals();
