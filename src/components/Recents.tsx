import { InputChangeEventDetail, IonItem, IonLabel, IonList, IonText, IonTitle } from "@ionic/react"
import { Entry } from "../types/Types.d"

const Recents: React.FC<{ entries: Entry[]}> = ({ entries }) => {

  const handleSelectNote = (entry: Entry) => {
    console.log(entry)
  }

  return (
    <IonList lines="inset">
      <IonTitle>My Memories</IonTitle>
      {entries.map((entry, index) => (
              <IonItem onClick={() => handleSelectNote(entry)}>
                <IonLabel>{entry.body}</IonLabel>
              </IonItem>
            ))}
    </IonList>
  )
}

type listitemparams = {
  value: string,
  function: Function
}

const ListItem = (value: string, onClick: Function) => {
  <IonText>{value}</IonText>
}

const List = (items: string, onItemClick: Function) => {
  
}

export default Recents