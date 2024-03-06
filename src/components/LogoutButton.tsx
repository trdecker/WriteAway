import { useAuth0 } from '@auth0/auth0-react'
import { Browser } from '@capacitor/browser'
import { IonButton } from '@ionic/react'
import { logoutUri } from '../../auth.config'

// This should reflect the URL added earlier to your "Allowed Logout URLs" setting
// in the Auth0 dashboard.
const LogoutButton: React.FC = () => {
  const { logout } = useAuth0()

  const doLogout = async () => {
    await logout({
      logoutParams: {
        returnTo: logoutUri,
      },
      async openUrl(url) {
         // Redirect using Capacitor's Browser plugin
        await Browser.open({
          url,
          windowName: "_self"
        })
      }
    })
  }

  return <IonButton onClick={doLogout}>Log out</IonButton>
}

export default LogoutButton