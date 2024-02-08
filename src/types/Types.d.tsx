import { InputChangeEventDetail } from "@ionic/react";

export type Entry = {
  userId: string,
  id?: number,
  title: string,
  body: string,
  date: string
}

export interface InputCustomEvent extends CustomEvent {
  detail: InputChangeEventDetail;
  target: HTMLIonInputElement;
}