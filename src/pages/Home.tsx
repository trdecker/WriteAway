/**
 * @description List of recent notes, calendar to select date, settings menu, search button, and new note button.
 * @author Tad Decker
 * 
 * 2-6-2024
 */

import EntriesByTag from '../components/home/EntriesByTag'
import SearchMenu from '../components/home/SearchMenu'
import Calendar from '../components/home/Calendar'
import Recents from '../components/home/Recents'
import { IonPage, IonContent, IonHeader, IonIcon, IonButton, IonRow, IonCol, IonMenu, IonToolbar, IonTitle, IonFab, IonFabButton, IonSelect, IonSelectOption } from '@ionic/react'
import { menuController } from '@ionic/core/components'
import { useAppContext } from '../contexts/AppContext'
import { add, menu, search } from 'ionicons/icons'
import { Entry, Mood } from '../types/Types.d'
import { getEntries } from '../api/NotesApi'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { store } from '../../config'
import './Home.css'
import EntriesByMood from '../components/home/EntriesByMood'

const Home: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([])
  const [selectedView, setSelectedView] = useState<string>('Recents')

  const { reload } = useAppContext()

  const history = useHistory()

  /**
   * Retrieve entries!
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

  const handleSignOut = async () => {
    await store.set('username', '')
    await store.set('userId', '')
    await store.set('authToken', '')
    await menuController.close('mainMenu')
    history.push('/login')
  }

  const handleAddEntry = async () => {
    await store.set('editMode', false)
    await store.set('currEntry', null)
    reload()
    history.push('/entry')
  }

  const handleSelectEntry = async (entry: Entry) => {
    await store.set('editMode', true)
    await store.set('currEntry', entry)
    reload()
    menuController.close('searchMenu')
    history.push('/entry')
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
        {/* User profile and logout button */}
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
          {/* Text input and list of entries */}
          <SearchMenu 
            entries={entries} 
            handleSelectEntry={(entry) => handleSelectEntry(entry)} 
          />
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
        <IonRow>
          <IonCol>
            <IonSelect 
              id="selector"
              interface="popover"
              value={selectedView}
              onIonChange={(val) => setSelectedView(val.detail.value)}
              defaultValue="recents"
            >
              <IonSelectOption value="recents">Recents</IonSelectOption>
              <IonSelectOption value="date">By Date</IonSelectOption>
              <IonSelectOption value="tag">By Tag</IonSelectOption>
              <IonSelectOption value="mood">By Mood</IonSelectOption>
            </IonSelect>
          </IonCol>
        </IonRow>

        {/* Recents */}
        {
          selectedView === 'recents' && 
          <IonRow>
            <IonCol>
              <Recents
                entries={entries}
                handleSelectEntry={(entry) => handleSelectEntry(entry)} 
               />
            </IonCol>
          </IonRow>
        }

        {/* By Date */}
        {
          selectedView === 'date' &&
          <div id="row">
            <Calendar 
              entries={entries}  
              handleSelectEntry={(entry) => handleSelectEntry(entry)}
            />
          </div>
        }

        {/* By Tag */}
        {
          selectedView === 'tag' && 
          <IonRow>
            <IonCol>
              <EntriesByTag 
                entries={entries} 
                handleSelectEntry={(entry) => handleSelectEntry(entry)}
              />
            </IonCol>
          </IonRow>
        }

        {/* By Mood */}
        {
          selectedView === 'mood' && 
          <IonRow>
            <IonCol>
              <EntriesByMood
                entries={entries} 
                handleSelectEntry={(entry) => handleSelectEntry(entry)}
              />
            </IonCol>
          </IonRow>
        }

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
