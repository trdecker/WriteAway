/**
 * @file usePhotoGallery.tsx
 * @description functions to take and remove photos.
 * 
 * @author Tad Decker
 * @fixme Images being saved locally? Change that?
 * Updated 4-2-2024
 */

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Preferences } from '@capacitor/preferences'
import { Capacitor } from '@capacitor/core'
import { isPlatform } from '@ionic/react'
import { useState } from 'react'

export interface UserPhoto {
    filepath: string
    webviewPath?: string
		base64String?: string
}

const PHOTO_STORAGE = 'photos'

/**
 * @param path {string}
 * @description The base64FromPath method is a helper 
 * util that downloads a file from the supplied 
 * path and returns a base64 representation of that file.
 * @returns Promise<String>
 */
export async function base64FromPath(path: string): Promise<String> {
	const response = await fetch(path)
	const blob = await response.blob()
	return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onerror = reject
			reader.onload = () => {
					if (typeof reader.result === 'string') {
							resolve(reader.result)
					} else {
							reject('method did not return a string')
					}
			}
			reader.readAsDataURL(blob)
	})
}

/**
 * @description Contains a hook that is called on 
 * on rendering that creates a function (takePhoto) and an array
 * (photos).
 * 
 * @function savePicture
 * @function takePhoto
 * @function deletePhoto
 * @function clearPhotos
 * @returns takePhoto, photos
 */
export function usePhotoGallery() {
	const [photos, setPhotos] = useState<UserPhoto[]>([])

	/**
	 * Get the base64data from the photo, then save the photo the capacitor Filesystem.
	 * @param photo {Photo}
	 * @param fileName {string}
	 * @todo Don't want to save these locally!
	 * @returns newImage {UserPhoto}
	 */
	const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
		let base64Data: string

		// Get the base64Data
		// "hybrid" will detect Cordova or Capacitor (usually means mobile, or at least NOT WEB)
		if (isPlatform('hybrid')) {
			const file = await Filesystem.readFile({
				path: photo.path!
			})
			base64Data = file.data as string
		} else {
			// This will occur if the application is running on the web.
			base64Data = await base64FromPath(photo.webPath!) as string // This may display a type error. It will still run.
		}

		const savedFile = await Filesystem.writeFile({
			path: fileName,
			data: base64Data, // This may also display a type error.
			directory: Directory.Data
		})

		// Display and return the new image
		if (isPlatform('hybrid')) {
			// Dislay new image by rewriting the 'file://' path to HTTP
			// Details: https://ionicframework.com/docs/building/webview#file-protocol
			return {
				filepath: savedFile.uri,
				webviewPath: Capacitor.convertFileSrc(savedFile.uri),
				base64String: base64Data
			}
		} 
		else {
			// Use webPath to display new image instead of base64 since it's
			// already loaded into memory
			return {
				filepath: fileName,
				webviewPath: photo.webPath,
				base64String: base64Data
			}
		}
	}

	const deletePhoto = async (photo: UserPhoto) => {
		// Remove this photo from the Photos reference data array
		const newPhotos = photos.filter((p) => p.filepath !== photo.filepath)

		// Update photos array cache by overwriting the existing photo array
		Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) })

		// delete photo file from filesystem
		const filename = photo.filepath.substring(photo.filepath.lastIndexOf('/') + 1)
		await Filesystem.deleteFile({
			path: filename,
			directory: Directory.Data,
		})
		setPhotos(newPhotos)
	}

	const takePhoto = async () => {
		console.log('taking photo...')
		const photo = await Camera.getPhoto({
			resultType: CameraResultType.Uri,
			source: CameraSource.Camera,
			quality: 100
		})

		const fileName = Date.now() + '.jpeg'
		const savedFileImage = await savePicture(photo, fileName)
		const newPhotos = [...photos, savedFileImage ]
		setPhotos(newPhotos)

		// TODO: Will I need this?
		// Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) })
	}

	/**
	 * @function clearPhotos
	 * @description Clear the photo gallery of all photos.
	 */
	const clearPhotos = async () => {
		for (const photo of photos) {
			deletePhoto(photo)
		}
	}

    return {
			takePhoto,
			deletePhoto,
			clearPhotos,
			photos
    }
}


