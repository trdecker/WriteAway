import { InputChangeEventDetail, IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTextarea, useIonLoading } from "@ionic/react"
import { arrowBack, menu, pencil } from "ionicons/icons"
import { useEffect, useRef, useState } from 'react'
import { store } from '../../config'
import { createEntry, updateEntry } from '../api/NotesApi'
import { Entry } from '../types/Types.d'
import { useHistory } from 'react-router'
import { useAppContext } from '../contexts/AppContext'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const NewNote: React.FC = () => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [entryId, setEntryId] = useState('')
  const [presentLoading, dismissLoading] = useIonLoading()


  const { reload } = useAppContext()

  const history = useHistory()

  useEffect(() => {
      async function getCurrEntry() {
        try {
          const currEntry = await store.get('currEntry')
          if (currEntry) {
            setTitle(currEntry.title)
            setBody(currEntry.body)
            setEntryId(currEntry.id)
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

  const changeBody = (ev: CustomEvent<InputChangeEventDetail>) => {
		const target = ev.target as HTMLIonInputElement | null

		if (target) {
			const val = target.value as string
			setBody(val)
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
        date: new Date().toString()
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
        {/* Title */}
        <IonTextarea value={title} onIonInput={changeTitle}/>
        {/* Body rich text editor */}
        <ReactQuill theme="snow" value={body} onChange={setBody} />

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