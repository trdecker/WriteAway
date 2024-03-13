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
import { Entry } from '../../types/Types.d'
import './EntryList.css'

const EntryList: React.FC<{ entries: Entry[], id?: string, select: (entry: Entry) => void }> = ({ entries, id, select: emitSelect }) => {

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
    <IonList lines="inset" id={id}>
      {entries.map((entry) => (
        <IonItem id="Item" key={entry.id} onClick={() => emitSelect(entry)}>
          <IonLabel id="Text">{entry.title}</IonLabel>
          <IonLabel id="Text">{displayDate(entry.date)}</IonLabel>
          <IonLabel id="Text">{displayBody(entry.body)}</IonLabel>
        </IonItem>))
      }
    </IonList>
  )
}

export default EntryList