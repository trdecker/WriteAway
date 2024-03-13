import { useAuth0 } from '@auth0/auth0-react'
import { Browser } from '@capacitor/browser'
import { IonButton } from '@ionic/react'
import { store } from '../../config'

const LoginButton: React.FC<{ signup?: boolean }> = ({ signup=false }) => {
  const { loginWithRedirect } = useAuth0()

  const login = async () => {
    // TODO: Have the "signup" button go directly to the sign up page!
    await loginWithRedirect({
      async openUrl(url) {
         // Redirect using Capacitor's Browser plugin
        await Browser.open({
          url,
          windowName: "_self"
        })
      }
    })
  }

  return <IonButton onClick={login}>{signup ? 'Sign up' : 'Log in'}</IonButton>
}

export default LoginButton