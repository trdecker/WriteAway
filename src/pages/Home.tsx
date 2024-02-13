/**
 * @description List of recent notes, calendar to select date, settings menu, search button, and new note button.
 * @author Tad Decker
 * 
 * 2-6-2024
 */

import { IonPage, IonContent, IonHeader, IonIcon, IonButton, IonDatetime, IonRow, IonCol, IonMenu, IonToolbar, IonTitle, IonText, IonInput } from '@ionic/react'
import { add, menu, search } from 'ionicons/icons'
import './Home.css'
import { useEffect, useState } from 'react'
import { Entry } from '../types/Types.d'
import { getEntries } from '../api/NotesApi'
import { useHistory } from 'react-router'
import { menuController } from '@ionic/core/components'
import EntryList from '../components/EntryList'
import { store } from '../../config'
import { useAppContext } from '../contexts/AppContext'

const Home: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchResult, setSearchResult] = useState<Entry[]>([])
  const { reload } = useAppContext()

  const history = useHistory()

  /**
   * Retrieve notes
   */
  useEffect(() => {
    async function fetchData() {
      try {
        const userId = await store.get("userId")
        if (userId) {
          const entries = await getEntries(userId)

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

  const changeSearchValue = async (ev: Event) => {
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
    const tempSearchResult = entries?.filter((entry) => {
      return (
        entry.body.toLowerCase().includes(searchValue.toLowerCase()) ||
        entry.title.toLowerCase().includes(searchValue.toLowerCase())
        // TODO: Be able to search by date (check for month, day, etc)
      )
    }) ?? []
    setSearchResult(searchValue.trim() === '' ? [] : tempSearchResult)
  
  }, [searchValue])

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

  const handleSelectEntry = async (entry: any) => {
    await store.set('editMode', true)
    await store.set('currEntry', entry)
    reload()
    menuController.close('searchMenu')
    history.push('/entry')
  }

  return (
    <>
      {/* Menu */}
      <IonMenu menuId="mainMenu" contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonButton onClick={handleSignOut}>Sign out</IonButton>
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
          <IonInput fill="outline" onIonInput={changeSearchValue}></IonInput>
          <EntryList entries={searchResult} select={handleSelectEntry}></EntryList>
        </IonContent>
      </IonMenu>

      {/* Page */}
      <IonPage id="main-content">
        {/* Header */}
        <IonHeader>
          <IonToolbar id="header">
            {/* Settings Button */}
            <IonButton slot="start" id="roundButton" onClick={() => menuController.open('mainMenu')}><IonIcon icon={menu} /></IonButton>
            {/* Search Button */}
            <IonButton slot="end" id="roundButton" onClick={() => menuController.open('searchMenu')}><IonIcon icon={search} /></IonButton>
          </IonToolbar>
        </IonHeader>
        {/* Content */}
        <IonContent fullscreen> 
          {/* Calendar */}
          <div id="row">
            <IonDatetime presentation="date"/>
          </div>

          {/* Recents */}
          <IonRow id="row">
            <IonCol>
              <IonTitle>Recents</IonTitle>
              {/* TODO: Make this pick the most recent 5 */}
              <EntryList entries={entries?.slice(0, 5) ?? []} select={handleSelectEntry} /> 
            </IonCol>
          </IonRow>
          
          {/* Add note button */}
          <div id="footer">
            <IonButton id="roundButton" onClick={handleAddEntry}><IonIcon size="large" icon={add}/></IonButton>
          </div>
        </IonContent>
      </IonPage>
    </>
  )
}

export default Home
