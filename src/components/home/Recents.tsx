/**
 * @deprecated
 */

import { IonList, IonTitle } from "@ionic/react"
import { Entry } from "../../types/Types.d"
import EntryList from "./EntryList"

type params = {
  entries: Entry[]
  handleSelectEntry: (entry: Entry) => void
}

const Recents: React.FC<params> = ({ entries, handleSelectEntry }) => {

  /**
   * @param a Entry
   * @param b Entry
   * @returns difference in time
   */
  const compareByDate = (a: Entry, b: Entry) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)

    return dateB.getTime() - dateA.getTime()
  }

  return (
    <IonList lines="inset">
      <IonTitle>My Memories</IonTitle>
      <EntryList 
        id="entry-list" 
        entries={entries?.sort(compareByDate).slice(0, 5) ?? []} 
        select={handleSelectEntry} 
      />
    </IonList>
  )
}

export default Recents