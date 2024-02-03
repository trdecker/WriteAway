import { IonPage, IonContent, IonHeader, IonIcon, IonButton, IonDatetime, IonRow, IonCol } from '@ionic/react';
import { add, menu, search } from 'ionicons/icons';
import './Home.css';
import Recents from '../components/Recents';
import { useEffect, useState } from 'react';
import sampleEntries from '../../public/assets/sampleEntries.json'
import { Entrie } from '../types/Types.d';


const Home: React.FC = () => {

  const [entries, setEntries] = useState<Entrie[]>()

  // Retrieve notes
  useEffect(() => {
    async function fetchData() {
      try {
        // const userId = await AsyncStorage.getItem('userId')
        // const result = await setNotes (result.notes)
        console.log(sampleEntries)
        setEntries(sampleEntries)
      } catch (error) {
        console.error(error)
      }
    }
    
    fetchData()
  }, [])

  const addNote = () => {
    console.log('addnote clicked')
  }

  const openMenu = () => {
    console.log('addnote clicked')
  }

  const handleSearchButton = () => {
    console.log('addnote clicked')
  }

  return (
    <IonPage>
      {/* Content */}
      <IonContent fullscreen>
        <IonHeader id="header">
          {/* Menu Button */}
          <IonButton id="roundButton"><IonIcon icon={menu} /></IonButton>
          {/* Search Button */}
          <IonButton id="roundButton"><IonIcon icon={search} /></IonButton>
        </IonHeader>
        {/* Calendar */}
        <div id="row">
          <IonDatetime presentation="date"/>
        </div>

        {/* Recents */}
        <IonRow id="row">
          <IonCol size="4">
            <Recents entries="entries" />
          </IonCol>
        </IonRow>
        
        {/* Add note button */}
        <div id="footer">
          <IonButton id="roundButton" href="/newnote"><IonIcon size="large" icon={add}/></IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
