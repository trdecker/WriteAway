import { useState, useEffect } from 'react'
import { isPlatform } from '@ionic/react'
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Preferences } from '@capacitor/preferences'
import { Capacitor } from '@capacitor/core'

export interface UserPhoto {
    filepath: string
    webviewPath?: string
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
 * Additionally, the function loads all the saved photos immediately
 * in the function loadSaved, which exists within a useEffect hook
 * (meaning it will render immediately when the usePhotoGallery)
 * @returns takePhoto, photos
 */
export function usePhotoGallery() {
	const [photos, setPhotos] = useState<UserPhoto[]>([])

	const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
		let base64Data: string
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

		// Display the new image
		if (isPlatform('hybrid')) {
			// Dislay new image by rewriting the 'file://' path to HTTP
			// Details: https://ionicframework.com/docs/building/webview#file-protocol
			return {
				filepath: savedFile.uri,
				webviewPath: Capacitor.convertFileSrc(savedFile.uri)
			}
		} else {
			// Use webPath to display new image instead of base64 since it's
			// already loaded into memory
			return {
				filepath: fileName,
				webviewPath: photo.webPath
			}
		}
	}

	const deletePhoto = async (photo: UserPhoto) => {
		// Remove this photo from the Photos reference data array
		const newPhotos = photos.filter((p) => p.filepath !== photo.filepath)

		// Update photos array cache by overwriting the existing photo array
		Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) })

		// delete photo file from filesystem
		const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1)
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
		const newPhotos = [savedFileImage, ... photos]
		setPhotos(newPhotos)

		// Will I need this?
		// Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) })
	}

	useEffect(() => {
		const loadSaved = async () => {
				const { value } = await Preferences.get({ key: PHOTO_STORAGE })

				const photosInPreferences = (value ? JSON.parse(value) : []) as UserPhoto[]
				// For mobile, we can directly get each photo file on the Filesystem.
				// For web, we have to read each image into base64.
				if (!isPlatform('hybrid')) {
						for (let photo of photosInPreferences) {
								const file = await Filesystem.readFile({
										path: photo.filepath,
										directory: Directory.Data
								})
								photo.webviewPath = `data:image/jpeg;base64,${file.data}`
						}
				}
				setPhotos(photosInPreferences)
		}
		// loadSaved()
	}, [])

    return {
			takePhoto,
			deletePhoto,
			photos
    }
}


