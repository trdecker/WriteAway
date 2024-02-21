import { InputChangeEventDetail } from "@ionic/react";

export enum Moods {
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
  moods: Moods[] // Which are strings
}

export interface InputCustomEvent extends CustomEvent {
  detail: InputChangeEventDetail;
  target: HTMLIonInputElement;
}