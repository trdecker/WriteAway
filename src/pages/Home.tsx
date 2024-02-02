import { IonPage, IonContent, IonHeader, IonTabBar, IonTabButton, IonTabs, IonIcon, IonToolbar, IonButton } from '@ionic/react';
import { add, menu, pencil } from 'ionicons/icons';
import './Home.css';
import { IonReactRouter } from '@ionic/react-router';
import Recents from '../components/Recents';
import { Route } from 'react-router';

const Home: React.FC = () => {
  return (
    <IonPage>
      {/* Content */}
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          Recent journal entries
          - Clickable
          - Searchable
          - Editable
          Button to create new journal entry
          {/* Menu Button */}
          <IonButton><IonIcon icon={menu}/></IonButton>
          {/* Search Button */}
        </IonHeader>
        {/* Calendar */}
        {/* Recents */}
        {/* Add note button */}
        <IonButton shape="round"><IonIcon icon={add}/></IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
