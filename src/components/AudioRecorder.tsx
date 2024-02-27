/**
 * @file AudioRecorder.tsx
 * @description Component utilizing capacitor-voice-recorder.
 * 
 * @author Tad Decker
 * 2/26/2024
 */

import { IonActionSheet, IonContent, IonRoute, useIonLoading } from "@ionic/react"
import { VoiceRecorder } from "capacitor-voice-recorder"
import { useState } from "react"


const AudioRecorder: React.FC<{}> = ({}) => {
  const [presentLoading, dismissLoading] = useIonLoading()
  const [isRecording, setIsRecording] = useState(false)

  
  /**
   * 
   */
  const recordAudio = async () => {
    await VoiceRecorder.requestAudioRecordingPermission()
  
    if (await VoiceRecorder.hasAudioRecordingPermission()) {      
      const status = (await VoiceRecorder.getCurrentStatus()).status
      console.log(status)
      // If nothing, start recording
      if (status == 'NONE') {
        console.log('Start recording!')
        presentLoading()
        await VoiceRecorder.startRecording()
        dismissLoading()
      }    
      // If recording, STOP (for now)
      else if (status == 'RECORDING') {
        console.log('...stopping...')
        presentLoading()
        const recording = await VoiceRecorder.stopRecording() // {"value": { recordDataBase64: string, msDuration: number, mimeType: string }}
        console.log(recording)

        dismissLoading()
      }
      // If paused, resume
      else if (status == 'PAUSED') {
        console.log('...resuming...')
        presentLoading()
        await VoiceRecorder.resumeRecording()
        dismissLoading()
      }
    }
  }

  const handleStopRecording = async () => {
    presentLoading()
    await VoiceRecorder.stopRecording()
    dismissLoading()
  }

  return (
    <>
    <slot name="button" />
    <slot name="container" />
    </>
  )
}


export default AudioRecorder