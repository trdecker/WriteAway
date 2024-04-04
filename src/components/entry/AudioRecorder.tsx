/**
 * @file AudioRecorder.tsx
 * @description Component utilizing capacitor-voice-recorder.
 * 
 * @author Tad Decker
 * 2/26/2024
 */

import { IonButton, IonFab, IonFabButton, IonIcon, IonRow } from "@ionic/react"
import { VoiceRecorder } from "capacitor-voice-recorder"
import { closeOutline, mic, pause, play, stop } from "ionicons/icons"
import { useEffect, useState } from "react"
import ReactAudioPlayer from "react-audio-player"
import './AudioRecorder.css'

type AudioRecorderProps = {
  cancel: () => void,
  save: (recording: HTMLAudioElement) => void
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ cancel, save}) => {
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

  const startRecording = async () => {
    if (await VoiceRecorder.hasAudioRecordingPermission()) {      
      if (recordingStatus == 'NONE') {
        VoiceRecorder.startRecording()
        setRecordingStatus('RECORDING')
        // dismissLoading()
      }    
    }
  }
  
  const resumeRecording = async () => {
    if (recordingStatus == 'PAUSED') {
      VoiceRecorder.resumeRecording()
      setRecordingStatus('RECORDING')
    }
  }

  const pauseRecording = async () => {
    if (recordingStatus == 'RECORDING') {
      VoiceRecorder.pauseRecording()
      setRecordingStatus('PAUSED')
    }
  }

  const stopRecording = async () => {
    const recording = await VoiceRecorder.stopRecording() // {"value": { recordDataBase64: string, msDuration: number, mimeType: string }}
    if (recording?.value?.recordDataBase64) {
      const base64Sound = recording.value.recordDataBase64
      const mimeType = recording.value.mimeType
      const audioRef = new Audio(`data:${mimeType};base64,${base64Sound}`)
      setRecording(audioRef)
      setRecordingStatus('NONE')
    }
  }

  const handleCancel = async () => {
    const recordingStatus = await VoiceRecorder.getCurrentStatus()
    if (recordingStatus.status === 'RECORDING')
      await VoiceRecorder.stopRecording()
    setRecordingStatus('NONE')
    cancel()
  }

  return (
    <div id="recorder">
      {/* Close button */}
      <IonRow id="close-button">
        <IonButton 
          onClick={() => handleCancel()} 
          fill="clear" color="dark" 
          shape={'circle' as any}
        >
          <IonIcon icon={closeOutline} size="large" />
        </IonButton>
      </IonRow>

      {/* Recording button */}
      <IonRow id="recording-button">
        {
          // If not recording,
          recordingStatus === 'NONE' ? 
            <IonButton onClick={startRecording} color="danger" shape={'circle' as any}>
              <IonIcon size="large" icon={buttonIcon} />
            </IonButton>
          :
            <IonButton onClick={stopRecording} color="danger" shape={'circle' as any}>
              <IonIcon size="large" icon={stop} />
            </IonButton>
        }
      </IonRow>

      {/* Pause and save button */}
      <IonRow id="pause-save-buttons">
        {
          recording?.src || recordingStatus === 'RECORDING' ?
            <IonButton
              color={recordingStatus === 'NONE' ? 'light' : 'primary'}
              fill={
                recordingStatus === 'NONE' ?
                'outline' :
                'solid'
              }
              onClick={
                recordingStatus === 'RECORDING' ?
                () => pauseRecording() :
                () => resumeRecording()
              }
              disabled={recordingStatus === 'NONE'}
              shape={'circle' as any}
            >
              <IonIcon 
                size="large" 
                icon={
                recordingStatus === 'PAUSED' ?
                mic :
                pause
              } 
              />
            </IonButton>
          : null
        }

        {/* Save button */}
        {
          recording?.src ?
            <IonButton onClick={() => save(recording)}>Save</IonButton>
          : null
        }
      </IonRow>

      {/* Playback */}
      <IonRow id="playback">
        {
          recording?.src ?
          <ReactAudioPlayer src={recording?.src} controls /> :
          null
        }
      </IonRow>
    </div>
  )
}


export default AudioRecorder