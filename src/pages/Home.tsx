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

  // Retrieve notes
  useEffect(() => {
    async function fetchData() {
      try {
        console.log('in fetch Data')
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
  }, [reload]) // Is this right?

  const changeSearchValue = async (ev: Event) => {
    const target = ev.target as HTMLIonInputElement | null

		if (target) {
			const val = target.value as string
      setSearchValue(val)
      console.log('searchValue:', val)
		}
  }

  useEffect(() => {
    const tempSearchResult = entries?.filter((entry) => {
      console.log(entry)
      entry.body.toLowerCase().includes(searchValue.toLowerCase()) ||
      entry.title.toLowerCase().includes(searchValue.toLowerCase())
      // TODO: Be able to search by date (check for month, day, etc)
    }) ?? []
    setSearchResult(searchValue.trim() === '' ? entries : tempSearchResult)
    console.log(tempSearchResult)
  }, [searchValue])

  const handleAddNote = async () => {
    await store.set('editMode', false)
    history.push('/entry')
  }

  const handleOpenMenu = async () => {
    await menuController.open('mainMenu')
  }

  const handleSearchButton = async () => {
    await menuController.open('searchMenu')
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
          <IonText>Example stuff</IonText>
          <IonText>Color scheme</IonText>
          <IonText>Sign out</IonText>
        </IonContent>
      </IonMenu>

      {/* Search menu */}
      <IonMenu menuId="searchMenu" side="end" contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu Content</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonInput fill="outline" onIonInput={changeSearchValue}></IonInput>
          <EntryList entries={searchResult}></EntryList>
        </IonContent>
      </IonMenu>

      {/* Page */}
      <IonPage id="main-content">
        {/* Header */}
        <IonHeader>
          <IonToolbar>
          {/* Settings Button */}
          <IonButton id="roundButton" onClick={handleOpenMenu}><IonIcon icon={menu} /></IonButton>
          {/* Search Button */}
          <IonButton id="roundButton" onClick={handleSearchButton}><IonIcon icon={search} /></IonButton>
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
              <EntryList entries={entries?.slice(0, 5) ?? []} /> 
            </IonCol>
          </IonRow>
          
          {/* Add note button */}
          <div id="footer">
            <IonButton id="roundButton" onClick={handleAddNote}><IonIcon size="large" icon={add}/></IonButton>
            <IonButton onClick={() => console.log(reload)}>TEST</IonButton>
          </div>
        </IonContent>
      </IonPage>
    </>
  )
}

export default Home
