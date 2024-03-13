/**
 * @file SearchMenu.tsx
 * @Descriptoin The Search menu modularized as its own component.
 * @author Tad Decker
 * TODO: Finish
 * 
 * 2-16-2024
 */

import { Entry } from "../../types/Types.d"
import { IonInput } from "@ionic/react"
import { useState, useEffect } from "react"
import EntryList from "./EntryList"

type props = {
  entries: Entry[],
  handleSelectEntry: (entry: Entry) => void
}

const SearchMenu: React.FC<props> = ({ entries, handleSelectEntry }) => {
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchResult, setSearchResult] = useState<Entry[]>([])

  /**
   * @description Update search results if search value changes
   */
  useEffect(() => {
    const searchEntries = entries?.filter((entry) => {
      console.log(entry)
      return (
        entry.body.toLowerCase().includes(searchValue.toLowerCase()) ||
        entry.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        searchDates(entry.date, searchValue.toLowerCase()) ||
        entry?.moods?.some(mood => mood.toLowerCase().includes(searchValue.toLowerCase())) ||
        entry?.tags?.some(tag => tag.toLowerCase().includes(searchValue.toLowerCase()))
      )
    }) ?? []
    setSearchResult(searchValue.trim() === '' ? [] : searchEntries)
  
  }, [searchValue])

  /**
   * @param dateString 
   * @param searchValue 
   * @returns boolean
   */
  function searchDates(dateString: string, searchValue: string): boolean {
    // Check if empty
    if (!dateString || !searchValue)
      return false

    const date = new Date(dateString)

    // Check date string formats
    if (date?.toISOString()?.toLowerCase().includes(searchValue) ?? false)
      return true
    else if (date.toLocaleDateString('en-US', { weekday: 'long', month: 'long' })?.toLowerCase().includes(searchValue) ?? false)
      return true
    else if (date.toLocaleString()?.toLowerCase().includes(searchValue) ?? false)
      return true
    else if (date.toString()?.toLowerCase().includes(searchValue) ?? false)
      return true
    else if (date.toUTCString()?.toLowerCase().includes(searchValue) ?? false)
      return true
    else if (date.toLocaleTimeString()?.toLowerCase().includes(searchValue) ?? false)
      return true

    return false
  }


  /**
   * Change search value. Called when the associated ionInput is typed into.
   * @param ev Event
   */
    const handleChangeSearchValue = async (ev: Event) => {
      const target = ev.target as HTMLIonInputElement | null
  
      if (target) {
        const val = target.value as string
        setSearchValue(val)
      }
    }

  return (
    <>
      <IonInput fill="outline" onIonInput={handleChangeSearchValue}></IonInput>
      <EntryList id="entrylist" entries={searchResult} select={handleSelectEntry}></EntryList>
    </>
  )
}

export default SearchMenu