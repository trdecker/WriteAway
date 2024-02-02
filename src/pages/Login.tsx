import { IonButton, IonCol, IonContent, IonImg, IonInput, IonPage, IonRow} from "@ionic/react"
import './Login.css'
import { useState } from "react";

const Login: React.FC = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const changeUsername = (ev: Event) => {
		const val = (ev.target as HTMLIonInputElement).value as string
		setUsername(val)
	}

	const changePassword = (ev: Event) => {
		const val = (ev.target as HTMLIonInputElement).value as string
		setPassword(val)
	}

	const handleLogin = () => {
		console.log(username, password)
	}

	const handleSignup = () => {
		console.log(username, password)
	}

	return (
			<IonPage>	
				<IonContent id="content">
					<IonRow class="IonRow">
						<IonImg id="logo" src="../../public/assets/logo1.png" alt="WriteAway logo" ></IonImg>
					</IonRow>
					{/* Username entry */}
					<IonRow class="IonRow">
						<IonCol>
							<IonInput 
								label="Username:"
								autocapitalize="none"
								security="true"
								fill="outline"
								onIonInput={changeUsername}
							/>
						</IonCol>
					</IonRow>	
					{/* Password entry */}
					<IonRow class="IonRow">
						<IonCol>
							<IonInput 
								label="Password:"
								autoCapitalize="none"
								type="password"
								fill="outline"
								onIonInput={changePassword}
							/>
						</IonCol>
					</IonRow>
					{/* Login/signup buttons */}
					<IonRow class="IonRow">
						<IonCol>
							<IonButton onClick={handleLogin}>Login</IonButton>
						</IonCol>
						<IonCol>
							<IonButton onClick={handleSignup}>Signup</IonButton>
						</IonCol>
					</IonRow>
				</IonContent>
			</IonPage>
	);
};

export default Login;