/**
 * @description Entry list componenent. Display list of entries, and emit event when one is clicked.
 * @param entries Entry[]
 * @param select (entry: Entry) => void
 * @author Tad Decker
 * 
 * 2-6-2024
 */


import { IonItem, IonLabel, IonList, IonText } from '@ionic/react'
import { stripHtml } from 'string-strip-html'
import { Entry } from '../types/Types.d'

const EntryList: React.FC<{ entries: Entry[], select: (entry: Entry) => void }> = ({ entries, select: emitSelect }) => {

  function displayDate (date: string): string {
    const stringDate: string = date ? new Date(date).toLocaleDateString() : 'N/A'

    return stringDate
  }

  function displayBody(body: string): string {
    let text = stripHtml(body).result.substring(0, 50) 
    if (body.length > 50)
      text += '...'
    return text
  }

  return (
    <IonList lines="inset">
      {entries.map((entry) => (
              <IonItem key={entry.id} onClick={() => emitSelect(entry)}>
                <IonLabel>{entry.title}</IonLabel>
                <IonLabel>{displayDate(entry.date)}</IonLabel>
                <IonLabel>{displayBody(entry.body)}</IonLabel>
              </IonItem>
            ))}
    </IonList>
  )
}

export default EntryList