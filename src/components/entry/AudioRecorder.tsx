/**
 * @file AudioRecorder.tsx
 * @description Component utilizing capacitor-voice-recorder.
 * 
 * @author Tad Decker
 * 2/26/2024
 */

import { IonButton, IonIcon, IonRow, IonText } from "@ionic/react"
import { VoiceRecorder } from "capacitor-voice-recorder"
import { closeOutline, mic, pause, stop } from "ionicons/icons"
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
        console.log('starting...')
        setRecording(undefined)
        VoiceRecorder.startRecording()
        setRecordingStatus('RECORDING')
        // dismissLoading()
      }    
    }
  }
  
  const resumeRecording = async () => {
    if (recordingStatus == 'PAUSED') {
      console.log('resuming...')
      VoiceRecorder.resumeRecording()
      setRecordingStatus('RECORDING')
    }
  }

  const pauseRecording = async () => {
    if (recordingStatus == 'RECORDING') {
      console.log('pausing...')
      VoiceRecorder.pauseRecording()
      setRecordingStatus('PAUSED')
    }
  }

  const stopRecording = async () => {
    const recording = await VoiceRecorder.stopRecording() // {"value": { recordDataBase64: string, msDuration: number, mimeType: string }}
    if (recording?.value?.recordDataBase64) {
      console.log('stopping...')
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
          // If not recording
          recordingStatus === 'NONE' ? 
            <IonButton onClick={startRecording} color="danger" shape={'circle' as any}>
              <IonIcon size="large" icon={buttonIcon} />
            </IonButton>
          : recordingStatus === 'RECORDING' ?
          // If recording, pause recording
            <IonButton onClick={pauseRecording} color="danger" shape={'circle' as any}>
              <IonIcon size="large" icon={pause} />
            </IonButton>
          : recordingStatus === 'PAUSED' ?
            // If paused, resume
          <IonButton onClick={resumeRecording} color="danger" shape={'circle' as any}>
            <IonIcon size="large" icon={mic} />
          </IonButton>
          : null
        }
      </IonRow>

      {/* Pause or save button */}
      <IonRow id="pause-save-buttons">
        {
          // Currently recording or paused, show "done" button
          !recording?.src || recordingStatus !== 'NONE' ?
            <IonButton
              onClick={stopRecording}
              disabled={recordingStatus === 'NONE'}
              shape={'circle' as any}
            >
              Done
            </IonButton>
          // Not recording or paused, show "save" button
          : recording?.src ?
            <IonButton
              onClick={() => save(recording)}
              shape={'circle' as any}
            >
              Save
            </IonButton>
          : null
        }
      </IonRow>

      {/* Playback */}
      <IonRow id="playback">
        {
          recording?.src && recordingStatus === 'NONE' ?
            <ReactAudioPlayer src={recording?.src} controls /> 
          : null
        }
      </IonRow>
    </div>
  )
}


export default AudioRecorder