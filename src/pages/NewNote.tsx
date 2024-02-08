import { InputChangeEventDetail, IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTextarea, useIonLoading } from "@ionic/react"
import { arrowBack, menu, pencil } from "ionicons/icons"
import { useState } from 'react'
import { store } from '../../config'
import { createEntry } from '../api/NotesApi'
import { Entry } from '../types/Types.d'
import { useHistory } from 'react-router'


const NewNote: React.FC = () => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [presentLoading, dismissLoading] = useIonLoading()

  const history = useHistory()

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
    history.push('/home')
  }

  const handleSaveEntry = async () => {
    try {
      await presentLoading()
      const userId = await store.get("userId")
      const newEntry: Entry = {
        userId,
        title,
        body,
        date: new Date().toString()
      }
      console.log(newEntry)
      await createEntry(userId,newEntry)
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
        <IonTextarea onIonInput={changeTitle}/>
        {/* Body */}
        <IonTextarea onIonInput={changeBody}/>

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