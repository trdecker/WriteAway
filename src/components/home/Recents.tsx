/**
 * @description View most recent entries of user
 * @author Tad Decker
 * 
 * 3/28/2024
 */

import { IonCol, IonFab, IonFabButton, IonIcon, IonList, IonRow, IonTitle } from "@ionic/react"
import { Entry } from "../../types/Types.d"
import { useAppContext } from '../../contexts/AppContext'
import EntryList from "./EntryList"
import { add } from "ionicons/icons"
import { useHistory } from 'react-router'
import { store } from '../../../config'

type params = {
  entries: Entry[]
  handleSelectEntry: (entry: Entry) => void
}

const Recents: React.FC<params> = ({ entries, handleSelectEntry }) => {

  const history = useHistory()
  const { reload } = useAppContext()

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
    <div>
      {/* Entry list */}
      <IonTitle>My Memories</IonTitle>
      <EntryList 
        id="entry-list" 
        entries={entries?.sort(compareByDate).slice(0, 5) ?? []} 
        select={handleSelectEntry} 
      />

      {/* New entry button */}
      <IonRow>
        <IonCol id="footer">
          <IonFab>
            <IonFabButton id="roundButton" onClick={async () => {
                await store.set('editMode', false)
                await store.set('currEntry', null)
                reload()
                history.push('/entry')
              }}>
            <IonIcon size="large" icon={add}/>
            </IonFabButton>
          </IonFab>
        </IonCol>
      </IonRow>
    </div>
  )
}

export default Recents