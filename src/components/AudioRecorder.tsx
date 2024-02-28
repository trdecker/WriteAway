/**
 * @file AudioRecorder.tsx
 * @description Component utilizing capacitor-voice-recorder.
 * 
 * @author Tad Decker
 * 2/26/2024
 */

import { IonButton, IonIcon, IonRow } from "@ionic/react"
import { VoiceRecorder } from "capacitor-voice-recorder"
import { mic, pause, stop } from "ionicons/icons"
import { useEffect, useState } from "react"
import ReactAudioPlayer from "react-audio-player"

type AudioRecorderProps = {
  cancel: () => void,
  save: (recording: HTMLAudioElement) => void
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ cancel, save}) => {
  // const [presentLoading, dismissLoading] = useIonLoading() // This is acting funny
  const [recordingStatus, setRecordingStatus] = useState<string>('NONE')
  const [buttonIcon,  setButtonicon] = useState<string>('')
  const [recording, setRecording] = useState<HTMLAudioElement | undefined>()

  useEffect(() => {
    if (recordingStatus === 'NONE')
      setButtonicon(mic)
    else if (recordingStatus === 'RECORDING')
      setButtonicon(pause)
    else if (recordingStatus === 'PAUSED')
      setButtonicon(mic)

  }, [recordingStatus])

  const recordAudio = async () => {
    await VoiceRecorder.requestAudioRecordingPermission()
  
    if (await VoiceRecorder.hasAudioRecordingPermission()) {      
      const status = (await VoiceRecorder.getCurrentStatus()).status
      // If nothing, start recording
      if (status == 'NONE') {
        // presentLoading()
        VoiceRecorder.startRecording()
        setRecordingStatus('RECORDING')
        // dismissLoading()
      }    
      // If recording, STOP (for now)
      else if (status == 'RECORDING') {
        // presentLoading()
        VoiceRecorder.pauseRecording()
        setRecordingStatus('PAUSED')
        // dismissLoading()
      }
      // If paused, resume
      else if (status == 'PAUSED') {
        // presentLoading()
        VoiceRecorder.resumeRecording()
        setRecordingStatus('RECORDING')
        // dismissLoading()
      }
    }
  }

  const handleStopRecording = async () => {
    // presentLoading()
    const recording = await VoiceRecorder.stopRecording() // {"value": { recordDataBase64: string, msDuration: number, mimeType: string }}
    if (recording?.value?.recordDataBase64) {
      const base64Sound = recording.value.recordDataBase64
      const mimeType = recording.value.mimeType
      const audioRef = new Audio(`data:${mimeType};base64,${base64Sound}`)
      setRecording(audioRef)
      setRecordingStatus('NONE')
    }
    // dismissLoading()
  }

  return (
    <>
      <IonRow>
        <IonButton onClick={recordAudio}><IonIcon icon={buttonIcon} /></IonButton>
        {
          recordingStatus === 'RECORDING' || recordingStatus === 'PAUSED' ?
          <IonButton onClick={handleStopRecording}><IonIcon icon={stop} /></IonButton> :
          null
        }
        <IonButton onClick={() => cancel()} fill="clear">Cancel</IonButton>
        {
          recording?.src ?
          <IonButton onClick={() => save(recording)}>Save</IonButton> :
          null
        }
      </IonRow>
      <IonRow>
        {
          recording?.src ?
          <ReactAudioPlayer src={recording?.src} controls /> :
          null
        }
      </IonRow>
    </>
  )
}


export default AudioRecorder