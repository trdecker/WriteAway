import { IonItem, IonLabel, IonList, IonText, IonTitle } from '@ionic/react'
import { Entry } from '../types/Types.d'
import { useHistory } from 'react-router'
import { store } from '../../config'
import { useAppContext } from '../contexts/AppContext'

const EntryList: React.FC<{ entries: Entry[]}> = ({ entries }) => {

  const { reload } = useAppContext()

  const history = useHistory()
  const handleSelectNote = async (entry: Entry) => {
    await store.set('editMode', true)
    await store.set('currEntry', entry)
    reload()
    history.push('/entry')
  }

  // const displayDate: string = (date: string) => {
  //   return new Date(date).toISOString
  // }

  return (
    <IonList lines="inset">
      {entries.map((entry) => (
              <IonItem key={entry.id} onClick={() => handleSelectNote(entry)}>
                <IonLabel>{entry.title}</IonLabel>
                <IonText>{entry.body}</IonText>
              </IonItem>
            ))}
    </IonList>
  )
}

export default EntryList