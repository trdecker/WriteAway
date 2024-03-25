/**
 * @file Calendar.tsx
 * @description Filter entries by a selected date on the calendar
 * 
 * @author Tad Decker
 * 3/20/2024
 */

import { IonDatetime, IonList } from "@ionic/react"
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
      const selectedDateString = selectedDate.substring(0, 10)

      const newEntries = []

      for (const entry of entries) {
        if (entry?.date) {
          const entryDateString = new Date(entry.date).toISOString().substring(0, 10)
          if (entryDateString === selectedDateString)
            newEntries.push(entry)
        }
      }

      setDayEntries(newEntries)
    }

    updateEntries()
  }, [selectedDate])

  /**
   * @description If the user selecs 
   * @param newDate
   */
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