import { IonPage, IonContent, IonHeader, IonIcon, IonButton, IonDatetime, IonRow, IonCol, useIonLoading } from '@ionic/react'
import { add, menu, search } from 'ionicons/icons'
import './Home.css'
import Recents from '../components/Recents'
import { useEffect, useState } from 'react'
import { Entry } from '../types/Types.d'
import { getEntries } from '../api/NotesApi'
import { useHistory } from 'react-router'
import { store } from '../../config'

const Home: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>()
  const [presentLoading, dismissLoading] = useIonLoading()

  const history = useHistory()

  // Retrieve notes
  useEffect(() => {
    async function fetchData() {
      try {
        const userId = await store.get("userId")
        if (userId) {
          const entries = await getEntries(userId)

          if (entries) {
            // console.log(entries)
            setEntries(entries)
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
    
    fetchData()
  }, [])

  const handleAddNote = async () => {
    history.push('/newNote')
  }

  const handleOpenMenu = () => {
    console.log('openMenu clicked')
  }

  const handleSearchButton = () => {
    console.log('searchbutton clicked')
  }

  return (
    <IonPage>
      {/* Content */}
      <IonContent fullscreen>
        <IonHeader id="header">
          {/* Menu Button */}
          <IonButton id="roundButton" onClick={handleOpenMenu}><IonIcon icon={menu} /></IonButton>
          {/* Search Button */}
          <IonButton id="roundButton" onClick={handleSearchButton}><IonIcon icon={search} /></IonButton>
        </IonHeader>
        {/* Calendar */}
        <div id="row">
          <IonDatetime presentation="date"/>
        </div>

        {/* Recents */}
        <IonRow id="row">
          <IonCol>
            <Recents entries={entries ?? []} />
          </IonCol>
        </IonRow>
        
        {/* Add note button */}
        <div id="footer">
          <IonButton id="roundButton" onClick={handleAddNote}><IonIcon size="large" icon={add}/></IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
