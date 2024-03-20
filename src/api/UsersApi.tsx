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
