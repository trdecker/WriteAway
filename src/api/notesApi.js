/**
 * @file notesApi.js
 * @description The api calls to the backend to retrieve, edit, delete, and create notes.
 * @author Tad Decker
 * 
 * 11/11/2023
 */

import axios from 'axios'
import config from '../config/config.js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const url = config.url
const corsProxyUrl = config.corsProxyUrl
const dev = config.dev

/**
 * @param {String} userId
 * @returns an array of notes associated with the user
 */
export async function getNotes(userId) {
  try {
    const path = `${dev ? corsProxyUrl : ''}${url}/notes?userId=${encodeURIComponent(userId)}`
    const authToken = await AsyncStorage.getItem('authToken')
    console.log(path)
    console.log(authToken)

    const notes = await axios.get(path, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    return notes.data
  } catch (e) {
    console.error(e)
  }
}

/**
 * @param {String} userId
 * @param {String} item
 * @returns the response if success; else null
 */
export async function createNote(userId, item) {
  try {
    const authToken = await AsyncStorage.getItem('authToken')
    const path = `${dev ? corsProxyUrl : ''}${url}/notes?userId=${encodeURIComponent(userId)}`

    const response = await axios.post(path, item, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    return response
  } catch (e) {
    console.error(e)
    return null
  }
}

/**
 * @param {String} userId
 * @param {String} item
 * @returns the response if success; else null
 */
export async function updateNote(userId, item) {
  try {
    const itemToMake = { userId: userId, ...item }
    const authToken = await  AsyncStorage.getItem('authToken')
    const path =  `${dev ? corsProxyUrl : ''}${url}/notes?userId=${encodeURIComponent(userId)}`

    const response = await axios.put(path, itemToMake, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    return response
  } catch (e) {
    console.error(e)
    return null
  }
}

/**
 * @param {String} userId
 * @param {String} item
 * @returns the response if success; else null
 */
export async function deleteNote(userId, item) {
  try {
    const path = `${dev ? corsProxyUrl : ''}${url}/notes?userId=${encodeURIComponent(userId)}&noteId=${item.id}`
    const authToken = await AsyncStorage.getItem('authToken')

    console.log(authToken)
    console.log(path, item)

    const response = await axios.delete(path, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    return response
  } catch (e) {
    console.error(e)
    return null
  }
}
