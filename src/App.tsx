/**
 * @file App.tsx
 * @description Router to specific pages, import of import packages
 * @author Tad Decker
 * 
 * 2/1/2024
 */

import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { Redirect, Route } from 'react-router-dom'
import { IonReactRouter } from '@ionic/react-router'
import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Browser } from '@capacitor/browser'
import { App as CapApp } from '@capacitor/app'
import Home from './pages/Home'
import Login from './pages/Login'
import NewNote from './pages/Entry'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/* Theme variables */
import './theme/variables.css'
import { AppProvider } from './contexts/AppContext'

setupIonicReact()

const App: React.FC = () => {
  const { handleRedirectCallback } = useAuth0()

  useEffect(() => {
    // Handle the 'appUrlOpen' event and call `handleRedirectCallback`
    CapApp.addListener('appUrlOpen', async ({ url }) => {
      if (url.includes('state') && (url.includes('code') || url.includes('error'))) {
        await handleRedirectCallback(url);
      }
      // No-op on Android
      await Browser.close()
    })
  }, [handleRedirectCallback])

  return (
    <IonApp>
      <AppProvider>
        <IonReactRouter>
          <IonRouterOutlet>
            {/* Root (Redirects to login screen) */}
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            {/* Home page */}
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/entry">
              <NewNote />
            </Route>
            {/* Login page */}
            <Route exact path="/login">
              <Login />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </AppProvider>
    </IonApp>
)
}
  

export default App
