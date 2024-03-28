/**
 * @file Calendar.tsx
 * @description Filter entries by a selected date on the calendar
 * 
 * @todo Select multiple days?
 * 
 * @author Tad Decker
 * 3/20/2024
 */

import EntryList from "./EntryList"
import { IonCol, IonDatetime, IonFab, IonFabButton, IonIcon, IonList, IonRow } from "@ionic/react"
import { useAppContext } from '../../contexts/AppContext'
import { Entry } from "../../types/Types.d"
import { useEffect, useState } from "react"
import { useHistory } from 'react-router'
import { store } from '../../../config'
import { add } from "ionicons/icons"

type params = {
  entries: Entry[]
  handleSelectEntry: (entry: Entry) => void
}

const Calendar: React.FC<params> = ({ entries, handleSelectEntry }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString())
  const [dayEntries, setDayEntries] = useState<Entry[]>([])

  const history = useHistory()
  const { reload } = useAppContext()

  async function updateEntries() {
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

  useEffect(() => {
    updateEntries()
  }, [selectedDate, entries])

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
    <div>
      <IonList lines="inset">
        {/* Calendar */}
        <IonDatetime
          presentation="date"
          value={selectedDate}
          onIonChange={(val) => handleSelectDate(val?.detail?.value ?? '')}
        />
        {/* List of entries from that day */}
        <EntryList entries={dayEntries} select={handleSelectEntry} />
      </IonList>

      {/* Add note button */}
      <IonRow>
        <IonCol id="footer">
          <IonFab>
            <IonFabButton id="roundButton" onClick={async () => {
                await store.set('editMode', false)
                await store.set('currEntry', {
                  moods: [],
                  tags: [],
                  date: selectedDate.substring(0,10)
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

export default Calendar