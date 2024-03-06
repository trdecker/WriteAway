import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Storage } from '@ionic/storage'
import { defineCustomElements } from '@ionic/pwa-elements/loader'
import { Auth0Provider } from '@auth0/auth0-react'
import { domain, clientId, callbackUri } from '../auth.config'
import App from './App'
import './global.scss'

const store = new Storage()
store.create()

// Call the element loader before the render call
defineCustomElements(window);

/**
 * FIXME: Somehow this should trigger when the "back" arrow is pressed.
 * We want the user to be prevented from going "back" on the login screen!
 */
document.addEventListener('ionBackButton', (ev: any) => {
  ev.detail.register(10, () => {
    console.log('Handler was called!')
  })
})

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      useRefreshTokens={true}
      useRefreshTokensFallback={false}
      authorizationParams={{
        redirect_uri: callbackUri
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
)