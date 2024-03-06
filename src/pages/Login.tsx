/**
 * @file Login.tsx
 * @description The landing page of the application. Users may sign up or login into their account.
 * @author Tad Decker
 * 
 * 2/5/2024
 */

import { IonContent, IonImg, IonPage, IonRow, IonCol } from "@ionic/react"
import LoginButton from "../components/LoginButton"
import './Login.css'

const Login: React.FC = () => {

	return (
			<IonPage id="page">	
				<IonContent>
					<IonRow class="IonRow">
						<IonImg id="logo" src="../../public/assets/logo1-removebg.png" alt="WriteAway logo" ></IonImg>
					</IonRow>
					{/* Login/signup buttons */}
					<IonRow>
						<IonCol class="ButtonCol">
							<LoginButton />
						</IonCol>
						<IonCol class="ButtonCol">
							<LoginButton signup />
						</IonCol>
					</IonRow>
					{/* Loading overlay */}
				</IonContent>
			</IonPage>
	)
}

export default Login
