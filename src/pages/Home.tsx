/**
 * @description List of recent notes, calendar to select date, settings menu, search button, and new note button.
 * @author Tad Decker
 * 
 * 2-6-2024
 */

import { IonPage, IonContent, IonHeader, IonIcon, IonButton, IonDatetime, IonRow, IonCol, IonMenu, IonToolbar, IonTitle, IonInput, IonFab, IonFabButton, IonSelect, IonSelectOption } from '@ionic/react'
import { menuController } from '@ionic/core/components'
import { useAppContext } from '../contexts/AppContext'
import { add, menu, search } from 'ionicons/icons'
import { Entry, Mood } from '../types/Types.d'
import { useAuth0 } from '@auth0/auth0-react'
import { getEntries } from '../api/NotesApi'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { store } from '../../config'
import LogoutButton from '../components/LogoutButton'
import EntryList from '../components/EntryList'
import './Home.css'
import Profile from '../components/Profile'

const Home: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchResult, setSearchResult] = useState<Entry[]>([])
  const [selectedView, setSelectedView] = useState<string>('Recents')

  const { reload } = useAppContext()

  const history = useHistory()

  const { user } = useAuth0()

  /**
   * Retrieve notes
   */
  useEffect(() => {
    async function fetchData() {
      try {
        const username = user?.nickname
        if (username) {
          const entries = await getEntries(username)

          if (entries) {
            setEntries(entries)
          }
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [reload]) // How does this work?

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

  const handleAddEntry = async () => {
    await store.set('editMode', false)
    reload()
    history.push('/entry')
  }

  const handleSignOut = async () => {
    await store.set('username', '')
    await store.set('userId', '')
    await store.set('authToken', '')
    await menuController.close('mainMenu')
    history.push('/login')
  }

  const handleSelectEntry = async (entry: Entry) => {
    await store.set('editMode', true)
    await store.set('currEntry', entry)
    reload()
    menuController.close('searchMenu')
    history.push('/entry')
  }

  const compareByDate = (a: Entry, b: Entry) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)

    return dateB.getTime() - dateA.getTime()
  }

  return (
    <IonContent scrollY={false}>
      {/* Menu */}
      <IonMenu menuId="mainMenu" contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <Profile />
          {/* <IonButton onClick={handleSignOut}>Sign out</IonButton> */}
          <LogoutButton />
        </IonContent>
      </IonMenu>

      {/* Search menu */}
      <IonMenu menuId="searchMenu" side="end" contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Search entries</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonInput fill="outline" onIonInput={handleChangeSearchValue}></IonInput>
          <EntryList id="entrylist" entries={searchResult} select={handleSelectEntry}></EntryList>
        </IonContent>
      </IonMenu>

      {/* Page */}
      <IonPage id="main-content">
        {/* Header */}
        <IonHeader id="header">
          <IonToolbar>
            {/* Settings Button */}
            <IonButton slot="start" id="roundButton" onClick={() => menuController.open('mainMenu')}><IonIcon icon={menu} /></IonButton>
            {/* Search Button */}
            <IonButton slot="end" id="roundButton" onClick={() => menuController.open('searchMenu')}><IonIcon icon={search} /></IonButton>
          </IonToolbar>
        </IonHeader>
        {/* Content */}
        <IonContent fullscreen> 
        {/* <IonRow>
          <IonCol>
            <IonSelect 
              id="selector"
              interface="popover"
              value={selectedView}
              defaultValue="Recents"
            >
              <IonSelectOption>Recents</IonSelectOption>
              <IonSelectOption>By Date</IonSelectOption>
              <IonSelectOption>By Tag</IonSelectOption>
              <IonSelectOption>By Mood</IonSelectOption>
            </IonSelect>
          </IonCol>
        </IonRow> */}

          {/* Calendar */}
          <div id="row">
            <IonDatetime presentation="date"/>
          </div>

          {/* Recents */}
          <IonRow>
            <IonCol>
              <IonTitle>Recents</IonTitle>
              <EntryList id="entry-list" entries={entries?.sort(compareByDate).slice(0, 5) ?? []} select={handleSelectEntry} /> 
            </IonCol>
          </IonRow>

          {/* Add note button */}
          <IonRow>
            <IonCol id="footer">
              <IonFab>
                <IonFabButton id="roundButton" onClick={handleAddEntry}>
                <IonIcon size="large" icon={add}/>
                </IonFabButton>
              </IonFab>
            </IonCol>
          </IonRow>
          
        </IonContent>
      </IonPage>
    </IonContent>
  )
}

export default Home
