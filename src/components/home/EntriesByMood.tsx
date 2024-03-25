/**
 * @file Calendar.tsx
 * @description Filter entries by a selected mood from list
 * 
 * @author Tad Decker
 * 3/20/2024
 */

import { IonList, IonSelect, IonSelectOption } from "@ionic/react"
import { Entry, Mood } from "../../types/Types.d"
import { useEffect, useState } from "react"
import EntryList from "./EntryList"

type params = {
  entries: Entry[]
  handleSelectEntry: (entry: Entry) => void
}

const EntriesByMood: React.FC<params> = ({ entries, handleSelectEntry }) => {
  const [selectedMood, setSelectedMood] = useState<Mood>()
  const [moodEntries, setMoodEntries] = useState<Entry[]>([])

  useEffect(() => {
    async function updateEntries() {
      // TODO: Do the thing here!
      const newEntries: Entry[] = []

      for (const entry of entries) {
        if (selectedMood && entry?.moods?.includes(selectedMood)) {
          newEntries.push(entry)
        }
      }

      setMoodEntries(newEntries)
    }

    updateEntries()
  }, [selectedMood])

  return (
    <IonList lines="inset">
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
    </IonList>
  )
}

export default EntriesByMood