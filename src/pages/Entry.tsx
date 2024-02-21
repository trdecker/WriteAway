import { InputChangeEventDetail, IonButton, IonContent, IonHeader, IonIcon, IonPage, IonSelect, IonSelectOption, IonText, IonTextarea, useIonLoading } from "@ionic/react"
import { arrowBack, camera, menu, pencil } from "ionicons/icons"
import { useEffect, useState } from 'react'
import { store } from '../../config'
import { createEntry, updateEntry } from '../api/NotesApi'
import { Entry, Moods } from '../types/Types.d'
import { useHistory } from 'react-router'
import { usePhotoGallery, UserPhoto } from '../hooks/usePhotoGallery'
import { useAppContext } from '../contexts/AppContext'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const NewNote: React.FC = () => {
  const { photos, takePhoto } = usePhotoGallery()

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [entryId, setEntryId] = useState<number | undefined>()
  const [presentLoading, dismissLoading] = useIonLoading()

  const [selectedMoods, setSelectedMoods] = useState<Moods[]>([])

  const { reload } = useAppContext()

  const history = useHistory()

  /**
   * Get the current entry when "reload" changes
   */
  useEffect(() => {
      async function getCurrEntry() {
        try {
          const currEntry: Entry = await store.get('currEntry')
          if (currEntry) {
            setTitle(currEntry.title)
            setBody(currEntry.body)
            setEntryId(currEntry.id)
            setSelectedMoods(currEntry?.moods ?? [])
          }
        } catch (e) {
          console.error(e)
        } finally {
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

  const handleBackButton = async () => {
    await store.set('editMode', false) // Set back to false
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
        tags: [],
        moods: selectedMoods
      }
      // If editting an existing entry, update the entry. Else, create a new entry.
      const editMode = await store.get('editMode')
      if (editMode) {
        await updateEntry(userId, entry, entryId)
      } else {
        await createEntry(userId, entry)
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
          console.log(ev.detail.value)
          setSelectedMoods(ev.detail.value)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleTakePhoto = () => {
    takePhoto()
  }

  const handleRecordAudio = () => {}

  return (
    <IonPage>
      {/* Content */}
      <IonContent fullscreen>
        <IonHeader id="header">
          {/* Menu Button */}
          <IonButton id="roundButton" onClick={handleBackButton}><IonIcon icon={arrowBack} /></IonButton>
          {/* Search Button */}
          <IonButton id="roundButton"><IonIcon icon={menu} /></IonButton>
        </IonHeader>
        {/* Title*/}
        <IonTextarea value={title} onIonInput={changeTitle}/>

        {/* Tags and moods */}
        <IonSelect label="Tags" labelPlacement="floating" interface="popover" multiple={true}>
          <IonSelectOption value=""></IonSelectOption>
        </IonSelect>
        <IonSelect value={selectedMoods} label="Moods" labelPlacement="floating" interface="popover" multiple={true} onIonChange={handleSelectMood}>
          {/* Every "mood" will be shown */}
          {Object.keys(Moods).map((mood) => (
            <IonSelectOption key={mood}>{mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase()}</IonSelectOption>
          ))}
        </IonSelect>

        {/* Body rich text editor */}
        <ReactQuill theme="snow" value={body} onChange={setBody} />

        <IonButton id="roundButton" onClick={handleTakePhoto}><IonIcon icon={camera} /></IonButton>

        {/* Add note button */}
        <div id="footer">
          <IonButton id="roundButton"><IonIcon size="large" icon={pencil}/></IonButton>
          <IonButton onClick={handleSaveEntry}>Save</IonButton>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default NewNote