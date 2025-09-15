import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfig';
import { GraphDataProvider } from './contexts/graphDataContext.jsx';
import { PlanProvider } from './contexts/PlanContext.jsx';
import { SuperUserProvider } from './contexts/SuperUserContext.jsx';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import './index.css';
import './i18n/i18n';

const msalInstance = new PublicClientApplication(msalConfig); 

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <SuperUserProvider>
      <MsalProvider instance={msalInstance}>
        <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA}>
          <GraphDataProvider>
            <AuthProvider>
              <PlanProvider>
                <App />
              </PlanProvider>
            </AuthProvider>
          </GraphDataProvider>
        </GoogleReCaptchaProvider>
      </MsalProvider>
    </SuperUserProvider>
  // </React.StrictMode>,
)