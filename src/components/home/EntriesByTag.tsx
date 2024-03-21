/**
 * @file Calendar.tsx
 * @description Filter entries by a selected tag on list
 * 
 * @author Tad Decker
 * 3/20/2024
 */

import { IonList, IonSelect, IonSelectOption } from "@ionic/react"
import { useEffect, useState } from "react"
import { Entry } from "../../types/Types.d"
import EntryList from "./EntryList"

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

  useEffect(() => {
    async function updateEntries() {
      // TODO: Do the thing here!
      const newEntries: Entry[] = []

      for (const entry of entries) {
        if (entry?.tags?.includes(selectedTag)) {
          newEntries.push(entry)
        }
      }

      setTagEntries(newEntries)
    }

    updateEntries()
  }, [selectedTag])

  return (
    <IonList lines="inset">
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
    </IonList>
  )
}

export default EntriesByTag