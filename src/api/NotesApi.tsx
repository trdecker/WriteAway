/**
 * @file NotesApi.tsx
 * @description The api calls to the backend to retrieve, edit, delete, and create notes.
 * This is adapted from a separate project "NoteMaster", and uses the same api and database.
 * Although the use case is slightly different (journal entries vs notes), the functionality is identical.
 * @author Tad Decker
 * 
 * 11/11/2023: Created
 * 2/5/2025: Modified
 */

import axios from 'axios'
import { config, store } from '../../config'
import { Entry } from '../types/Types.d'
import { UserPhoto } from '../hooks/usePhotoGallery'

const url = config.url
const corsProxyUrl = config.corsProxyUrl
const isDev = config.isDev

/**
 * @param {String} userId
 * @returns an array of entries associated with the user
 */
export async function getEntries(userId: String) {
  try {
    const path = `${isDev ? corsProxyUrl : ''}${url}/notes?userId=${encodeURIComponent(userId as string)}`
    const authToken = await store.get('authToken')

    const response = await axios.get(path, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    return response?.data?.notes
  } catch (e) {
    console.error(e)
  }
}

/**
 * @param {String} userId
 * @param {Entry} entry
 * @returns the response if success; else null
 */
export async function createEntry(userId: String, entry: Entry, _photos: UserPhoto[]) {
  try {
    const authToken = await store.get('authToken')
    const path = `${isDev ? corsProxyUrl : ''}${url}/notes?userId=${encodeURIComponent(userId as string)}`

    const response = await axios.post(path, entry, {
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
 * @param {Entry} entry
 * @param {String} entryId
 * @returns the response if success; else null
 */
export async function updateEntry(userId: String, entry: Entry, entryId: number | undefined) {
  try {
    if (!entry)
      throw ("No entryId")
    const entryToUpdate = { id: entryId, ...entry }
    const authToken = await store.get('authToken')
    const path =  `${isDev ? corsProxyUrl : ''}${url}/notes?userId=${encodeURIComponent(userId as string)}`

    const response = await axios.put(path, entryToUpdate, {
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
 * @param {String} itemId
 * @returns the response if success; else null
 */
export async function deleteEntry(userId: String, itemId: String) { 
  try {
    if (!itemId)
      throw ('No item to delete')
  
    const path = `${isDev ? corsProxyUrl : ''}${url}/notes?userId=${encodeURIComponent(userId as string)}&noteId=${itemId}`
    const authToken = store.get('authToken')

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
