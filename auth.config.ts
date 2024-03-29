/**
 * @description I tried migrating to auth0, but as I realized that was out of the
 * scope of this project (as this is an example of front-end development, not back-end development
 * or an actual application to be used in production), I
 * quickly realized the time I was spending on authorization was unnecessary.
 * @deprected
 */

import { isPlatform } from "@ionic/react"

export const domain = "dev-1vvmxy1qoid3w4j6.us.auth0.com"
export const clientId = "b4U4hlgOVQauOj0E8C2Wfh2AiyRq94yj"
const appId = "com.auth0.samples"

// Use `auth0Domain` in string interpolation below so that it doesn't
// get replaced by the quickstart auto-packager
const auth0Domain = domain
const iosOrAndroid = isPlatform('hybrid')

export const callbackUri = iosOrAndroid
  ? `${appId}://${auth0Domain}/capacitor/${appId}/callback`
  : 'http://localhost:' + window.location.port + '/home'

export const logoutUri = iosOrAndroid
  ? `${appId}://${auth0Domain}/capacitor/${appId}/callback`
  : 'http://localhost:' + window.location.port + '/login'