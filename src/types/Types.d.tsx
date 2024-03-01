import { InputChangeEventDetail } from "@ionic/react"
import { UserPhoto } from "../hooks/usePhotoGallery"

export enum Mood {
  SAD = 'sad',
  HAPPY = 'happy',
  ANGRY = 'angry',
  GRATEFUL = 'grateful',
  EXCITED = 'excited',
  THOUGHTFUL = 'thoughtful',
  STRESSED = 'stressed'
}

export type Entry = {
  userId: string,
  id?: number,
  title: string,
  body: string,
  date: string,
  tags: string[],
  moods: Mood[], // Which are strings
  images: UserPhoto[],
  audio: any[]
}

// 
// 
/**
 * This is how items in the "tags" selector in Entry.tsx will appear.
 * Eventually I'd like the user to be able to add new tags, which is why they
 * need an id (so the list can have a unqiue identifier in case of duplicates)
 * @deprecated
 */
export type TagItem = {
  name: string,
  id: number
}

export interface InputCustomEvent extends CustomEvent {
  detail: InputChangeEventDetail;
  target: HTMLIonInputElement;
}