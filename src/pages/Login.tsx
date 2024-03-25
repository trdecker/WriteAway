/**
 * @file Login.tsx
 * @description The landing page of the application. Users may sign up or login into their account.
 * @author Tad Decker
 * 
 * 2/5/2024
 */

import { InputChangeEventDetail, IonButton, IonCol, IonContent, IonImg, IonInput, IonPage, IonRow, useIonLoading} from "@ionic/react"
import './Login.css'
import { useState } from 'react'
import { login, signup } from '../../src/api/UsersApi'
import { store } from "../../config"
import { useHistory } from "react-router"

const Login: React.FC = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const history = useHistory()
	const [presentLoading, dismissLoading] = useIonLoading()

	const changeUsername = (ev: CustomEvent<InputChangeEventDetail>) => {
		const target = ev.target as HTMLIonInputElement | null

		if (target) {
			const val = target.value as string
			setUsername(val)
		}
	}

	const changePassword = (ev: CustomEvent<InputChangeEventDetail>) => {
		const target = ev.target as HTMLIonInputElement | null

		if (target) {
			const val = target.value as string
			setPassword(val)
		}
	}

	const handleLogin = async () => {
		try {
			await presentLoading()
			const response = await login(username, password)
			if (response) {
				await store.set('username', response.username)
				await store.set('userId', response.userId)
				await store.set('authToken', response.token)

				history.push("/home")
			} else {
				// TODO: "Incorrect password" alert
			}
		} catch (e) {
			console.error('Error logging in.', e)
		} finally {
			await dismissLoading()
		}
	}

	const handleSignup = async () => {
		try {
			await presentLoading()
			const response = await signup(username, password)
			if (response) {
				await store.set('username', response.username)
				await store.set('userId', response.userId)
				await store.set('authToken', response.token)
	
				history.push("/home")
			} else {
				// TODO: "Incorrect password" alert
			}
		} catch (e) {
			console.error(e)
		} finally {
			await dismissLoading()
		}
	}
	
	/**
	 * FIXME: handle login if the enter key is pressed
	 * FIXME: Get rid of 'any' type
	 * @param ev
	 */
	const handleKeyUp = (ev: any) => {
		// console.log(ev)
		// if (event?.key === 'Enter') {
		// 	handleLogin()
		// }
	}


	return (
		<IonPage id="page">	
			<IonContent>
				<IonRow class="IonRow">
					<IonImg id="logo" src="../../public/assets/logo1-removebg.png" alt="WriteAway logo" ></IonImg>
				</IonRow>
				{/* Username entry */}
				<IonRow class="IonRow">
					<IonCol>
						<IonInput 
							id="IonInput"
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
				<IonRow>
					<IonCol class="ButtonCol">
						<IonButton onClick={handleLogin} onKeyUp={handleKeyUp}>Login</IonButton>
					</IonCol>
					<IonCol class="ButtonCol">
						<IonButton onClick={handleSignup} onKeyUp={handleKeyUp}>Signup</IonButton>
					</IonCol>
				</IonRow>
				{/* Loading overlay */}
			</IonContent>
		</IonPage>
	)
}

export default Login
