/**
 * @file PictureGrid.tsx
 * @author Tad Decker
 * @description Display photos in a grid. If one is selected, display in full screen. Allow user to delete photos.
 * 
 * @todo: spacing, prettiness
 * 3/29/2024
 */

import { usePhotoGallery, UserPhoto } from '../../hooks/usePhotoGallery'
import { IonActionSheet, IonButton, IonButtons, IonCol, IonFab, IonFabButton, IonIcon, IonImg, IonModal, IonRow } from "@ionic/react"
import { arrowBack, chevronBack, chevronForward, close, trash } from 'ionicons/icons'
import { useEffect, useRef, useState } from 'react'

type props = {
	photos: UserPhoto[]
	deletePhoto: (photo: UserPhoto) => void
}

const PictureGrid: React.FC<props> = ({ photos, deletePhoto }) => {
	const [photoToDelete, setPhotoToDelete] = useState<UserPhoto>()
	const [photoIndex, setPhotoIndex] = useState<number>(0)
	const [viewingPhoto, setViewingPhoto] = useState<boolean>(false)

	const viewPhoto = (index: number) => {
		setPhotoIndex(index)
		setViewingPhoto(true)
	}

	const closePhoto = () => {
		setViewingPhoto(false)
		setPhotoIndex(0)
	}

	return (
	<div id="picture-grid">
		{/* Images */}
		{
			photos.length > 0 ? 
			photos.map((photo, index) => (
					<IonCol size="6" key={index}>
					<IonImg onClick={() => viewPhoto(index)} src={photo.webviewPath} />
					</IonCol>
			)) : ''
		}
		<IonModal isOpen={viewingPhoto} id="modal">
			<IonRow>
				<IonCol>
					<IonFab>
						<IonFabButton onClick={closePhoto}><IonIcon icon={arrowBack} /></IonFabButton>
					</IonFab>
				</IonCol>
				<IonCol>
					<IonFab>
						<IonFabButton onClick={() => {
							if (photoIndex !== undefined) {
								setPhotoToDelete(photos[photoIndex])
							}
						}}><IonIcon icon={trash} /></IonFabButton>
					</IonFab>
				</IonCol>
			</IonRow>

			{
				photoIndex !== undefined ?
					<div>
						<IonImg src={ photos[photoIndex]?.webviewPath ?? ''} />
					</div>
				: null
			}

			{/* Forward/back chevrons */}
			{/* TODO: Put these on the photo! */}
			<IonRow>
        {/* Left chevron. Only display if NOT first item in list */}
        <IonCol>
          {
            photoIndex > 0 ?
              <IonFabButton onClick={() => viewPhoto(photoIndex-1)}>
                <IonIcon icon={chevronBack} />
              </IonFabButton>
            : null
          }
        </IonCol>
        {/* Right chevron. Only display if NOT the last item in list */}
				<IonCol>
          {
            photoIndex < photos.length-1 ?
						  <IonFabButton onClick={() => viewPhoto(photoIndex+1)}>
                <IonIcon icon={chevronForward} />
              </IonFabButton>
            : null
          }
				</IonCol>
			</IonRow>

		</IonModal>

		{/* Delete photo confirmation message */}
		<IonActionSheet
			isOpen={!!photoToDelete}
			buttons={[
				{
					text: 'Delete',
					role: 'destructive',
					icon: trash,
					handler: () => {
						if (photoToDelete) {
							deletePhoto(photoToDelete)
							setPhotoToDelete(undefined)
							setViewingPhoto(false)
						}
					},
				},
				{
					text: 'Cancel',
					icon: close,
					role: 'cancel', // What does "role" mean?
				},
			]}
			onDidDismiss={() => setPhotoToDelete(undefined)}
		/>
	</div>
	)
}

export default PictureGrid