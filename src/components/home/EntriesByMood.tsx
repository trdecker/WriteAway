/**
 * @file Calendar.tsx
 * @description Filter entries by a selected mood from list
 * 
 * @todo select multiple moods
 * 
 * @author Tad Decker
 * 3/20/2024
 */

import { IonSelect, IonSelectOption, IonRow, IonCol, IonFabButton, IonFab, IonIcon } from "@ionic/react"
import { Entry, Mood } from "../../types/Types.d"
import { useEffect, useState } from "react"
import EntryList from "./EntryList"
import { add } from "ionicons/icons"
import { useHistory } from 'react-router'
import { store } from '../../../config'
import { useAppContext } from '../../contexts/AppContext'

type params = {
  entries: Entry[]
  handleSelectEntry: (entry: Entry) => void
}

const EntriesByMood: React.FC<params> = ({ entries, handleSelectEntry }) => {
  const [selectedMood, setSelectedMood] = useState<Mood>()
  const [moodEntries, setMoodEntries] = useState<Entry[]>([])

  const history = useHistory()
  const { reload } = useAppContext()

  async function updateEntries() {
    const newEntries: Entry[] = []

    for (const entry of entries) {
      if (selectedMood && entry?.moods?.includes(selectedMood)) {
        newEntries.push(entry)
      }
    }

    setMoodEntries(newEntries)
  }

  useEffect(() => {
    updateEntries()
  }, [selectedMood, entries])

  return (
    <div>
      {/* Mood selector and list  */}
      <IonSelect 
        id="selector"
        interface="popover"
        value={selectedMood}
        onIonChange={(val) => setSelectedMood(val.detail.value)}
      >
        {Object.keys(Mood).map((mood) => (
          <IonSelectOption key={mood}>
            {mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase()}
          </IonSelectOption>
        ))}
      </IonSelect>

      {/* List of entries from that day */}
      <EntryList entries={moodEntries} select={handleSelectEntry} />

      {/* New entry button */}
      <IonRow>
        <IonCol id="footer">
          <IonFab>
            <IonFabButton id="roundButton" onClick={async () => {
                await store.set('editMode', false)
                await store.set('currEntry', {
                  date: new Date().toISOString().substring(0,10),
                  tags: [],
                  moods: [selectedMood]
                })
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

export default EntriesByMood