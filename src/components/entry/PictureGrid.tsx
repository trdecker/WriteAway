/**
 * @file PictureGrid.tsx
 * @author Tad Decker
 * @description Display photos in a grid. If one is selected, display in full screen. Allow user to delete photos.
 * 
 * 3/29/2024
 */

import { IonActionSheet, IonCol, IonFab, IonFabButton, IonIcon, IonImg, IonModal, IonRow, IonThumbnail } from "@ionic/react"
import { arrowBack, chevronBack, chevronForward, close, trash } from 'ionicons/icons'
import { UserPhoto } from '../../hooks/usePhotoGallery'
import { useState } from 'react'
import './PictureGrid.css'

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
	<div>
		{/* Images */}
    <div id="images">
      {
        photos.length > 0 ? 
          photos.slice(0,3).map((photo, index) => (
              <IonCol size="1" key={index}>
                {/* Only show up to three images. On the last image, if there's even more, darken the image
                and display a number of how many more images there are (ie, "+3") */}
                {
                  index < 3 ?
                  <div id="image-wrapper">
                    <IonThumbnail>
                      <IonImg alt={photo.filepath} onClick={() => viewPhoto(index)} src={photo.webviewPath} />
                    </IonThumbnail>
                    {
                      (photos.length > 3 && index === 2) ?
                        <div id="overlay-image">+{photos.length-3}</div>
                      : null
                    }
                  </div>
                  : null
                }
              </IonCol>
          ))
        : null
      }
    </div>

    {/* Photo viewing modal */}
		<IonModal isOpen={viewingPhoto}>
			<IonRow>
        {/* Back button */}
				<IonCol id="button-left">
					<IonFab>
						<IonFabButton onClick={closePhoto}><IonIcon icon={arrowBack} /></IonFabButton>
					</IonFab>
				</IonCol>
        {/* Delete button */}
				<IonCol id="button-right">
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
			<IonRow>
        {/* Left chevron. Only display if NOT first item in list */}
        <IonCol id="button-left">
          {
            photoIndex > 0 ?
              <IonFabButton onClick={() => viewPhoto(photoIndex-1)}>
                <IonIcon icon={chevronBack} />
              </IonFabButton>
            : null
          }
        </IonCol>
        {/* Right chevron. Only display if NOT the last item in list */}
				<IonCol id="button-right">
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
              // If the photo was the last in the list, lower the photo index.
              if (photoIndex === photos.length-1) {
                setPhotoIndex(photoIndex-1)
              }
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