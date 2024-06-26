/**
 * @description Page to create or edit an entry. Users can edit the title, body, tags, moods, and date.
 * @author Tad Decker
 * 
 * 2-6-2024
 */

import { IonActionSheet, IonButton, IonContent, IonFabButton, IonFooter, IonHeader, IonIcon, 
  IonInput, IonMenu, IonModal, IonPage, IonRow, IonSelect, IonSelectOption, IonText, IonTextarea, IonToolbar, useIonLoading } from "@ionic/react"
import { arrowBack, camera, close, menu, mic, play, save, trash } from "ionicons/icons"
import { createEntry, deleteEntry, updateEntry } from '../api/NotesApi'
import { usePhotoGallery, UserPhoto } from '../hooks/usePhotoGallery'
import { menuController } from '@ionic/core/components'
import { Entry, Mood, RecordingItem, TagItem } from '../types/Types.d'
import { useAppContext } from '../contexts/AppContext'
import { generateId } from "../utils/common"
import { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router'
import { store } from '../../config'
import AudioRecorder from "../components/entry/AudioRecorder"
import PictureGrid from "../components/entry/PictureGrid"
import ReactAudioPlayer from "react-audio-player"
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './Entry.css'

const NewNote: React.FC = () => {
  const { photos, takePhoto, deletePhoto, clearPhotos } = usePhotoGallery()
  const [photoToDelete, setPhotoToDelete] = useState<UserPhoto>()

  const [recordings, setRecordings] = useState<RecordingItem[]>([])
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const recordingModal = useRef<HTMLIonModalElement>(null)

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [entryId, setEntryId] = useState<number | undefined>()
  const [entryDate, setEntryDate] = useState<string>('')
  const [presentLoading, dismissLoading] = useIonLoading()

  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [userTags, setUserTags] = useState<string[]>([])
  const [newTag, _setNewTag] = useState<string | undefined>(undefined)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const [markedDelete, setMarkedDelete] = useState<boolean>(false)
  const [audioToDelete, setAudioToDelete] = useState<string>()

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
          setTitle(currEntry?.title ?? '')
          setBody(currEntry?.body ?? '')
          setEntryId(currEntry.id)
          setSelectedMoods(currEntry?.moods ?? [])
          setSelectedTags(currEntry?.tags ?? [])
          setIsEditMode(await store.get('editMode'))
          if (currEntry.date)
            setEntryDate((new Date(currEntry.date).toISOString().substring(0,10)))
        }

        // Retrive the tag names the user has created
        const tags: TagItem[] = await store.get('tags')
        // setUserTags(tags ?? [])
        // FIXME: This is hardcoded
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

  /**
   * @function
   * @description In some future date, adding the ability for users to create new tags would be super cool.
   * @deprecated
   */
  const handleSaveTag = () => {
    if (newTag) {
      let tags = userTags
      tags.push(newTag)
      setUserTags(tags)
      store.set('tags', tags)
      // reload()
    }
  }

  /**
   * @function handleBackButton
   * @description If the back button is pressed, reset all fields to null or empty.
   */
  const handleBackButton = async () => {
    await store.set('editMode', false) // Set back to false
    setIsEditMode(false)
    await store.set('currEntry', null)
    reload()
    setTitle('')
    setBody('')
    setSelectedMoods([])
    setSelectedTags([])
    setRecordings([])
    setEntryId(undefined)
    await clearPhotos()
    history.push('/home')
  }

  /**
   * @function handleSaveEntry
   * @description If editing: save the changes. Else, create a new entry.
   */
  const handleSaveEntry = async () => {
    try {
      await presentLoading()
      const userId = await store.get('userId')

      // Get a list of upload photos in the right format
      if (userId) {
        const entry: Entry = {
          userId,
          title,
          body,
          date: entryDate,
          tags: selectedTags,
          moods: selectedMoods,
          images: photos,
          audio: recordings
        }
        // If editting an existing entry, update the entry. Else, create a new entry.
        if (isEditMode) {
          await updateEntry(userId, entry, entryId)
        } else {
          await createEntry(userId, entry)
          await store.set('editMode', true)
          await store.set('currEntry', entry)
        }
      }
    } catch (e) {
      console.error("Error making note", e)
    } finally {
      dismissLoading()
    }
  }

  return (
    <IonPage>
      <IonContent>
        {/* Menu */}
        <IonMenu menuId="entryMenu" contentId="entry-content">
          {/* Delete entry */}
          <IonContent className="ion-padding">
            {/* Date */}
            <IonText>Date</IonText>
            <div id="dateInput">
              <IonInput
                type="date"
                fill="outline"
                value={entryDate}
                onIonInput={(ev) => {
                  setEntryDate(ev.detail.value ?? '')
                }} 
              />
            </div>

            {/* Select Tags */}
            <IonText>Tags</IonText>
            <IonSelect 
              labelPlacement="floating" 
              interface="popover" 
              onIonChange={(ev) => setSelectedTags(ev.detail.value ?? [])} 
              multiple={true}
              fill="outline"
              id="selector"
            >
              {/* Every user created tag will be shown */}
              {userTags.map((tag: string) => (
                <IonSelectOption key={tag}>{tag}</IonSelectOption>
              ))}
            </IonSelect>
            {/* New tag button */}
            {/* <IonButton id="new-tag" fill="clear" size="small">New Tag</IonButton>
            <IonAlert
              trigger="new-tag"
              header="Create new tag"
              buttons={['Cancel','OK']}
              inputs={[
                {
                  placeholder: 'My new tag'
                },
              ]}
            /> */}
            {/* Select Moods */}
            <IonText>Moods</IonText>
            <IonSelect
              value={selectedMoods}
              labelPlacement="floating"
              interface="popover" 
              multiple={true} 
              onIonChange={(ev) => setSelectedMoods(ev.detail.value ?? [])}
              fill="outline"
              id="selector"
            >
              {/* Every "mood" will be shown */}
              {Object.keys(Mood).map((mood) => (
                <IonSelectOption key={mood}>{mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase()}</IonSelectOption>
              ))}
            </IonSelect>
            {/* Delete Entry Button */}
            <IonRow id="delete-entry">
              <IonButton onClick={() => setMarkedDelete(true)} color="danger">
                <IonIcon icon={trash} size="large" />
                <IonText>&nbsp;&nbsp;Delete Entry</IonText>
              </IonButton>
            </IonRow>
          </IonContent>
        </IonMenu>

        <IonPage id="entry-content">
          {/* Header buttons */}
          <IonHeader id="header">
            <IonToolbar>
              {/* Menu Button */}
              <IonButton slot="start" id="roundButton" onClick={() => menuController.open('entryMenu')}><IonIcon icon={menu} /></IonButton>
              {/* Menu Button */}
              <IonButton id="roundButton" onClick={handleBackButton}><IonIcon icon={arrowBack} /></IonButton>
            </IonToolbar>
          </IonHeader>

          {/* Editable fields */}
          <IonContent>
            {/* Title*/}
            <div id="title">
              <IonTextarea 
                id="titleInput"
                value={title}
                onIonInput={(ev) => setTitle(ev.detail.value ?? '')}
                label="Title"
                labelPlacement="floating"
                fill="outline"
              />
            </div>

            {/* Images */}
            <IonRow id="picture-grid">
              <PictureGrid photos={photos} deletePhoto={deletePhoto}/>
            </IonRow>

            {/* Audio recordings */}
            {
              recordings.map(recording =>
                <IonRow id="audio-recording" key={recording.recording.src}>
                  {/* TODO: If screen is too small, display only a play button (OR a pop up window or shrink controls somehow?) */}
                  <ReactAudioPlayer src={recording.recording.src} controls />
                  {/* <IonButton shape={"circle" as any}><IonIcon icon={play} /></IonButton> */}
                  <IonButton
                    id="delete-recording-button"
                    color="danger"
                    shape={"circle" as any}
                    onClick={() => setAudioToDelete(recording.recordingId)}>
                    <IonIcon size="large" icon={trash} />
                  </IonButton>
                </IonRow>
              )
            }

            {/* Body rich text editor */}
            <ReactQuill 
              id="body"
              theme="snow" 
              value={body}
              onChange={setBody}
              preserveWhitespace
            />

            {/* Recording Modal */}
            <IonModal
              id="recording-modal"
              ref={recordingModal}
              isOpen={isRecording}
              // onWillDismiss={(ev) => onWill(ev)}
              initialBreakpoint={0.95}
              onDidDismiss={() => setIsRecording(false)}
            >
              <IonContent>
                <AudioRecorder
                  // Close the modal
                  cancel={() => setIsRecording(false)}
                  // Add the recording to recordings, and close the modal
                  save={(recording: HTMLAudioElement) => {
                    const recordingId: string = 'REC' + generateId().toString()
                    const recordingItem: RecordingItem = {
                      recordingId,
                      recording
                    }
                    setRecordings([...recordings, recordingItem])
                    setIsRecording(false)
                  }}
                />
              </IonContent>
            </IonModal>

          </IonContent>

          {/* Footer Buttons */}
          <IonFooter id="footer" collapse="fade"> 
            <IonFabButton onClick={() => takePhoto()}><IonIcon icon={camera} /></IonFabButton>
            <IonFabButton onClick={() => setIsRecording(true)}><IonIcon icon={mic} /></IonFabButton>
            <IonFabButton onClick={handleSaveEntry}><IonIcon icon={save} /></IonFabButton>
          </IonFooter>
        
        </IonPage>

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
          header={'Are you sure you want ' + (isEditMode ? 'to cancel?' : 'to delete this entry?')}
          buttons={[
            {
              text: 'Yes',
              role: 'destructive',
              icon: trash,
              handler: async () => {
                presentLoading()

                // If editing an existing item, delete from database
                if (!isEditMode) {
                  const userId = await store.get('userId')
                  if (entryId && userId) {
                    await deleteEntry(userId, entryId.toString())
                  }
                }
                await handleBackButton()
                dismissLoading()
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

        {/* Delete audio recording confirmation message */}
        <IonActionSheet
          isOpen={!!audioToDelete}
          buttons={[
            {
              text: 'Delete audio',
              role: 'destructive',
              icon: trash,
              handler: () => {
                // Delete the audio!
                if (audioToDelete) {
                  const index = recordings.findIndex((recording) => recording.recordingId === audioToDelete )
                  if (index > -1)  {
                    const newRecordings = recordings.filter(function(item) {
                      return item.recordingId !== audioToDelete
                    })
                    setRecordings(newRecordings)
                  }
                }
              },
            },
            {
              text: 'Cancel',
              icon: close,
              role: 'cancel',
            },
          ]}
          onDidDismiss={() => setAudioToDelete(undefined)}
        />
        
      </IonContent>
    </IonPage>
  )
}

export default NewNote