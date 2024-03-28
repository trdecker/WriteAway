/**
 * @file Calendar.tsx
 * @description Filter entries by a selected tag on list
 * 
 * @todo select multiple tags
 * 
 * @author Tad Decker
 * 3/20/2024
 */

import { IonRow, IonCol, IonFab, IonFabButton, IonIcon, IonSelect, IonSelectOption } from "@ionic/react"
import { useEffect, useState } from "react"
import { Entry } from "../../types/Types.d"
import EntryList from "./EntryList"
import { add } from "ionicons/icons"
import { useHistory } from 'react-router'
import { store } from '../../../config'
import { useAppContext } from '../../contexts/AppContext'

// FIXME: This is hardcoded. 
const tags = [
  "School",
  "Dating",
  "Church",
  "Work",
  "Family",
  "Hobbies",
  "Other"
]

type params = {
  entries: Entry[]
  handleSelectEntry: (entry: Entry) => void
}

const EntriesByTag: React.FC<params> = ({ entries, handleSelectEntry }) => {
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [tagEntries, setTagEntries] = useState<Entry[]>([])

  const history = useHistory()
  const { reload } = useAppContext()

  async function updateEntries() {
    const newEntries: Entry[] = []

    for (const entry of entries) {
      if (entry?.tags?.includes(selectedTag)) {
        newEntries.push(entry)
      }
    }

    setTagEntries(newEntries)
  }

  useEffect(() => {
    updateEntries()
  }, [selectedTag, entries])

  return (
    <div>
      {/* Tag selector */}
      <IonSelect 
        id="selector"
        interface="popover"
        value={selectedTag}
        onIonChange={(val) => setSelectedTag(val.detail.value)}
      >
        {tags.map((tag: string) => (
          <IonSelectOption key={tag}>{tag}</IonSelectOption>
        ))}
      </IonSelect>

      {/* List of entries from that day */}
      <EntryList entries={tagEntries} select={handleSelectEntry} />

            {/* New entry button */}
      <IonRow>
        <IonCol id="footer">
          <IonFab>
            <IonFabButton id="roundButton" onClick={async () => {
                await store.set('editMode', false)
                await store.set('currEntry', {
                  date: new Date().toISOString().substring(0,10),
                  tags: [selectedTag],
                  moods: []
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

export default EntriesByTag