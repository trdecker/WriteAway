/**
 * @file UsersApi.tsx
 * @description The api calls to the backend to sign up and login.
 * This is adapted from a separate project "NoteMaster", and uses the same api and database.
 * Although the use case is slightly different (journal entries vs notes), the functionality is identical.
 * @author Tad Decker
 * 
 * 11/20/2023: Created
 * 2/5/2024: Modified
 */

import axios from 'axios'
import { config } from '../../config'

const url = config.url
const corsProxyUrl = config.corsProxyUrl
const isDev = config.isDev

/**
 * @deprecated
 * @param {string} username
 * @param {string} password
 */
export async function signup(username: string, password: string) {
  try {
    const body = { username, password }
    const path =  `${(isDev) ? corsProxyUrl : ''}${url}/users/signup`

    const response = await axios.post(path, body)

    if (response.status === 200) {
      return response.data
    }
    else return null

  } catch (e) {
    console.error(e)
  }
}

/**
 * @deprecated
 * @param {string} username
 * @param {string} password
 */
export async function login(username: string, password: string ) {
  try {
    const path =  `${(isDev) ? corsProxyUrl : ''}${url}/users/login`
    const body = { username, password }

    const response = await axios.post(path, body)

    if (response.status === 200) {
      return response.data
    }
    else return null

  } catch (e) {
    console.error(e)
  }
}

/**
 * @deprecated
 * @param code
 */
export async function getToken(code: string) {
  try {
    console.log('in getToken')

    const options = {
      method: 'POST',
      url: 'https://dev-1vvmxy1qoid3w4j6.us.auth0.com/oauth/token',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      data: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: 'b4U4hlgOVQauOj0E8C2Wfh2AiyRq94yj',
        client_secret: 'pq_11w27k3GxGR3idCQTk0cI6DktLyIdtRwKCQ-sODisNViul8eLjpRllxcL_5p7',
        code: code,
        redirect_uri: 'https://localhost:8102/home' // FIXME: make this not dumb
      })
    }

    const response = await axios.request(options)
    console.log(response)
  } catch (e) {
    console.error(e)
  }
}