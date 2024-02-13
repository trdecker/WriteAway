/**
 * @description Entry list componenent. Display list of entries, and emit event when one is clicked.
 * @param entries Entry[]
 * @param select (entry: Entry) => void
 * @author Tad Decker
 * 
 * 2-6-2024
 */


import { IonItem, IonLabel, IonList, IonText } from '@ionic/react'
import { Entry } from '../types/Types.d'

const EntryList: React.FC<{ entries: Entry[], select: (entry: Entry) => void }> = ({ entries, select: emitSelect }) => {

  // const displayDate: string = (date: string) => {
  //   return new Date(date).toISOString
  // }

  return (
    <IonList lines="inset">
      {entries.map((entry) => (
              <IonItem key={entry.id} onClick={() => emitSelect(entry)}>
                <IonLabel>{entry.title}</IonLabel>
                <IonText>{entry.body}</IonText>
              </IonItem>
            ))}
    </IonList>
  )
}

export default EntryList