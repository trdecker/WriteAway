/**
 * @deprecated
 */

import {  IonDatetime, IonItem, IonLabel, IonList } from "@ionic/react"
import { useEffect, useState } from "react"
import { Entry } from "../../types/Types.d"
import EntryList from "./EntryList"

type params = {
  entries: Entry[]
  handleSelectEntry: (entry: Entry) => void
}

const Calendar: React.FC<params> = ({ entries, handleSelectEntry }) => {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [dayEntries, setDayEntries] = useState<Entry[]>([])

  useEffect(() => {
    async function updateEntries() {
      // TODO: Do the thing here!
    }

    updateEntries
  }, [selectedDate])

  const handleSelectDate = (newDate: string | string[]) => {
    if (newDate) {
      if (newDate.constructor === Array)
        setSelectedDate(newDate[0])
      else
        setSelectedDate(newDate as string)
    }
  }

  return (
    <IonList lines="inset">
      {/* Calendar */}
      <IonDatetime
        presentation="date"
        onIonChange={(val) => handleSelectDate(val?.detail?.value ?? '')}
      />
      {/* List of entries from that day */}
      <EntryList entries={dayEntries} select={handleSelectEntry} />
    </IonList>
  )
}

export default Calendar