import { Storage } from "@ionic/storage"

const config = {
  url: "https://notemasterapi.azurewebsites.net", // Yes I know this is bad practice, .env is being annoying.
  corsProxyUrl: "https://cors-anywhere.herokuapp.com/",
  isDev: "true" // And yes I know I could just use a bool. I'm working around not having to use a .env file so I'm treating this like one
}

const store = new Storage()
await store.create()

export {
  config,
  store
}