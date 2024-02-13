import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Storage } from '@ionic/storage'
import './global.scss'

const store = new Storage()
store.create()

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
  <React.StrictMode>
    <App />
  </React.StrictMode>
)