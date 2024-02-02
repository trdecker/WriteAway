import { IonPage, IonContent, IonHeader, IonTabBar, IonTabButton, IonTabs, IonIcon, IonToolbar, IonButton, IonDatetime, IonTitle, IonList, IonListHeader, IonRow, IonCol, IonRouterOutlet } from '@ionic/react';
import { add, menu, pencil, search } from 'ionicons/icons';
import './Home.css';
import { IonReactRouter } from '@ionic/react-router';
import Recents from '../components/Recents';
import { Route } from 'react-router';

const Home: React.FC = () => {
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
            <Recents />
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
