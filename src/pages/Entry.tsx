/**
 * @description Page to create or edit an entry. Users can edit the title, body, tags, moods, and date.
 * TODO: Edit date
 * @author Tad Decker
 * 
 * 2-6-2024
 */

import { InputChangeEventDetail, IonActionSheet, IonAlert, IonButton, IonCol, IonContent, IonHeader, IonIcon, IonImg, IonPage, IonRow, IonSelect, IonSelectOption, IonTextarea, useIonLoading } from "@ionic/react"
import { arrowBack, camera, close, menu, mic, pause, play, save, trash } from "ionicons/icons"
import { useEffect, useState } from 'react'
import { store } from '../../config'
import { createEntry, deleteEntry, updateEntry } from '../api/NotesApi'
import { Entry, Mood, TagItem } from '../types/Types.d'
import { useHistory } from 'react-router'
import { usePhotoGallery, UserPhoto } from '../hooks/usePhotoGallery'
import { VoiceRecorder, VoiceRecorderPlugin, RecordingData, GenericResponse, CurrentRecordingStatus } from 'capacitor-voice-recorder';
import { useAppContext } from '../contexts/AppContext'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import './Entry.css'
import ReactAudioPlayer from "react-audio-player"
import AudioRecorder from "../components/AudioRecorder"

const NewNote: React.FC = () => {
  const { photos, takePhoto, deletePhoto } = usePhotoGallery()
  const [photoToDelete, setPhotoToDelete] = useState<UserPhoto>()

  const [recordings, setRecordings] = useState<string[]>([])
  const [isRecording, setIsRecording] = useState(false)

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [entryId, setEntryId] = useState<number | undefined>()
  const [presentLoading, dismissLoading] = useIonLoading()

  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [userTags, setUserTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState<string | undefined>(undefined)
  const [isEditMode, setIsEditMode] = useState(false)

  const [markedDelete, setMarkedDelete] = useState(false)

  const { reload } = useAppContext()

  const history = useHistory()

  /**
   * Get the current entry when "reload" changes
   */
  useEffect(() => {
      async function getCurrEntry() {
        try {
          // presentLoading()
          const currEntry: Entry = await store.get('currEntry')
          if (currEntry) {
            setTitle(currEntry.title)
            setBody(currEntry.body)
            setEntryId(currEntry.id)
            setSelectedMoods(currEntry?.moods ?? [])
            setSelectedTags(currEntry?.tags ?? [])
            setIsEditMode(await store.get('editMode'))
          }

          // Retrive the tag names the user has created
          const tags: TagItem[] = await store.get('tags')
          // setUserTags(tags ?? [])
          setUserTags([
            "School",
            "Dating",
            "Church",
            "Work",
            "Family",
            "Hobbies",
            "Other"
          ])
          if (tags) {
            // setUserTags((prevTags) => [...prevTags, ...tags])
          }
        } catch (e) {
          console.error(e)
        } finally {
          dismissLoading()
        }
      }

      getCurrEntry()
  }, [reload])

  const changeTitle = (ev: CustomEvent<InputChangeEventDetail>) => {
		const target = ev.target as HTMLIonInputElement | null

		if (target) {
			const val = target.value as string
			setTitle(val)
		}
	}

  const changeNewTag = (ev: CustomEvent<InputChangeEventDetail>) => {
    const target = ev.target as HTMLIonInputElement | null

    if (target) {
      const val = target.value as string
      setNewTag(val)
    }
  }

  const handleSaveTag = () => {
    if (newTag) {
      let tags = userTags
      tags.push(newTag)
      setUserTags(tags)
      store.set('tags', tags)
      // reload()
    }
  }

  const handleBackButton = async () => {
    await store.set('editMode', false) // Set back to false
    setIsEditMode(false)
    await store.set('currEntry', null)
    reload()
    history.push('/home')
  }

  const handleSaveEntry = async () => {
    try {
      await presentLoading()
      const userId = await store.get("userId")
      const entry: Entry = {
        userId,
        title,
        body,
        date: new Date().toString(),
        tags: selectedTags,
        moods: selectedMoods
      }
      // If editting an existing entry, update the entry. Else, create a new entry.
      if (isEditMode) {
        await updateEntry(userId, entry, entryId)
      } else {
        await createEntry(userId, entry, photos)
        await store.set('editMode', true)
        await store.set('currEntry', entry)
      }
      // history.push('/home')
    } catch (e) {
      console.error("Error making note", e)
    } finally {
      dismissLoading()
    }
  }

  /**
   * @description When the selected moods change, update selectedMoods
   * @param ev CustomEvent
   */
  const handleSelectMood = async (ev: CustomEvent) => {
    try {
      if (ev?.detail?.value) {
        setSelectedMoods(ev.detail.value)
      }
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * @description When the selected moods change, update selectedMoods
   * @param ev CustomEvent
   */
  const handleSelectTag = async (ev: CustomEvent) => {
    try {
      if (ev?.detail?.value) {
        setSelectedTags(ev.detail.value)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteEntry = async () => {
    try {
      presentLoading()
      const userId = await store.get("userId")
      if (entryId) {
        await deleteEntry(userId, entryId.toString())
        handleBackButton()
      }
    } catch (e) {
      console.error(e)
    } finally {
      dismissLoading()
    }
  }

  /**
   * Prompts permission to take the photo, then accesses the camera.
   * TODO: Photo will save as part of the entry.
   */
  const handleTakePhoto = () => {
    takePhoto()
  }

  const handleRecordAudio= () => {
    setIsRecording(true)
  }

  return (
    <IonPage id="entryPage">
      {/* Content */}
      <IonContent fullscreen>
        {/* Header buttons */}
        <IonHeader id="header">
          {/* Menu Button */}
          <IonButton id="roundButton" onClick={handleBackButton}><IonIcon icon={arrowBack} /></IonButton>
          {/* Search Button */}
          <IonButton id="roundButton"><IonIcon icon={menu} /></IonButton>
        </IonHeader>

        {/* Title*/}
        <IonTextarea 
          id="title"
          value={title} 
          onIonInput={changeTitle}
          label="Title"
          labelPlacement="floating"
          fill="outline"
          />

        {/* Tags and Moods */}
        <IonRow>
          {/* Tags */}  
          <IonCol>
            <IonSelect 
              label="Tags" 
              labelPlacement="floating" 
              interface="popover" 
              onIonChange={handleSelectTag} 
              multiple={true}
              fill="outline"
              id="selector"
              >
              {/* Every user created tag will be shown */}
              {userTags.map((tag: string) => (
                <IonSelectOption key={tag}>{tag}</IonSelectOption>
              ))}
            </IonSelect>
          </IonCol>
            {/* Moods */}
          <IonCol>
            <IonSelect 
              value={selectedMoods} 
              label="Moods" 
              labelPlacement="floating" 
              interface="popover" 
              multiple={true} 
              onIonChange={handleSelectMood}
              fill="outline"
              id="selector"
            >
              {/* Every "mood" will be shown */}
              {Object.keys(Mood).map((mood) => (
                <IonSelectOption key={mood}>{mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase()}</IonSelectOption>
              ))}
            </IonSelect>
          </IonCol>
        </IonRow>

        {/* New tag button */}
        <IonButton id="new-tag" fill="clear" size="small">New Tag</IonButton>
        <IonAlert
          trigger="new-tag"
          header="Create new tag"
          buttons={['Cancel','OK']}
          inputs={[
            {
              placeholder: 'My new tag'
            },
          ]}
        />

        {/* Images */}
        <IonRow>
          {/* Images */}
          {
            photos.length > 0 ? 
            photos.map((photo, index) => (
              <IonCol size="6" key={index}>
                <IonImg onClick={() => setPhotoToDelete(photo)} src={photo.webviewPath} />
              </IonCol>
            )) : ''
          }
        </IonRow>

        {/* Audio recordings */}
        {
          recordings.map(recording => 
            <ReactAudioPlayer src="" controls />)
        }

        {/* Body rich text editor */}
        <ReactQuill 
          id="body"
          theme="snow" 
          value={body} 
          onChange={setBody}
          />

        {/* Buttons */}
        {/* TODO: pretty up and TODO: functionality :) */}
        <div id="footer">
          <IonButton id="roundButton" onClick={handleTakePhoto}><IonIcon icon={camera} /></IonButton>
          <IonButton id="roundButton" onClick={handleRecordAudio}><IonIcon icon={mic} /></IonButton>
          {/* <IonButton id="roundButton" onClick={() => VoiceRecorder.stopRecording()}><IonIcon icon={stop} /></IonButton> */}
          {/* <IonButton id="roundButton"><IonIcon size="large" icon={pencil}/></IonButton> */}
          <IonButton id="roundButton" onClick={handleSaveEntry}><IonIcon icon={save} /></IonButton>

          {/* TODO: make this disappear if NOT editting an item! */}
          {isEditMode ?
            <IonButton  id="roundButton" onClick={() => setMarkedDelete(true)} color="danger">
              <IonIcon icon={trash} size="large" />
            </IonButton>
            : null}
        </div>
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
                  deletePhoto(photoToDelete);
                  setPhotoToDelete(undefined);
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

        {/* Delete entry confirmation message */}
        <IonActionSheet
          isOpen={markedDelete}
          buttons={[
            {
              text: 'Are you sure you want to delete this entry?',
              role: 'destructive',
              icon: trash,
              handler: async () => {
                const userId = await store.get('userId')
                if (entryId && userId) {
                  deleteEntry(userId, entryId.toString())
                }
              },
            },
            {
              text: 'Cancel',
              icon: close,
              role: 'cancel'
            },
          ]}
          onDidDismiss={() => setMarkedDelete(false)}
        />

        <IonActionSheet
          
        />
      </IonContent>
    </IonPage>
  )
}

export default NewNote