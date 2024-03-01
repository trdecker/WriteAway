/**
 * FIXME: These should all be env variables!
 */

import { Storage } from "@ionic/storage"

const config = {
  url: "https://notemasterapi.azurewebsites.net", // Yes I know this is bad practice, .env is being annoying.
  corsProxyUrl: "https://cors-anywhere.herokuapp.com/",
  isDev: true,
  isLocal: false
}

const store = new Storage()
await store.create()

export {
  config,
  store
}