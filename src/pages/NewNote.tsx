import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTextarea } from "@ionic/react"
import { arrowBack, menu, pencil } from "ionicons/icons"


const NewNote: React.FC = () => (
  <IonPage>
    {/* Content */}
    <IonContent fullscreen>
      <IonHeader id="header">
        {/* Menu Button */}
        <IonButton id="roundButton" href="/home"><IonIcon icon={arrowBack} /></IonButton>
        {/* Search Button */}
        <IonButton id="roundButton"><IonIcon icon={menu} /></IonButton>
      </IonHeader>
      {/* Title */}
      <IonTextarea />
      {/* Body */}
      <IonTextarea />

      {/* Add note button */}
      <div id="footer">
        <IonButton id="roundButton"><IonIcon size="large" icon={pencil}/></IonButton>
        <IonButton>Save</IonButton>
      </div>
    </IonContent>
  </IonPage>
)

export default NewNote