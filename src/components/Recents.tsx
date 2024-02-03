import { IonList, IonText, IonTitle } from "@ionic/react"
import { Entrie } from "../types/Types.d"

const Recents: React.FC<Entrie[]> = (entries: Entrie[]) => {

  return (
    <IonList lines="inset">
      <IonTitle>My Memories</IonTitle>
      
    </IonList>
  )
}

type listitemparams ={
  value: string,
  function: Function
}

const ListItem = (value: string, onClick: Function) => {
  <IonText>{value}</IonText>
}

const List = (items: string, onItemClick: Function) => {
  
}

export default Recents