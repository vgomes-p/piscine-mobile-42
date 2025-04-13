import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "../components/Button";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Liking from "expo-linking"
import { useOAuth } from "@clerk/clerk-expo";

WebBrowser.maybeCompleteAuthSession()

export default function Signin() {
	const [isLoading, setIsLoading] = useState(false)
	const googleOAuth = useOAuth({ strategy: "oauth_google"})
	const githubOAuth = useOAuth({ strategy: "oauth_github"})

	async function onGoogleSignIn() {
		try {
			setIsLoading(true)
			const redirectUrl = Liking.createURL("/")
			const oAuthFlow = await googleOAuth.startOAuthFlow({ redirectUrl })
			if(oAuthFlow.authSessionResult.type === "success"){
				if (oAuthFlow.setActive){
					await oAuthFlow.setActive({ session: oAuthFlow.createdSessionId })
				}
			} else {
				setIsLoading(false)
			}
		} catch (error) {
			console.log(error)
			setIsLoading(false)
		}
	}

	async function onGitHUbSignIn() {
		try {
			setIsLoading(true)
			const redirectUrl = Liking.createURL("/")
			const oAuthFlow = await githubOAuth.startOAuthFlow({ redirectUrl })
			if(oAuthFlow.authSessionResult.type === "success"){
				if (oAuthFlow.setActive){
					await oAuthFlow.setActive({ session: oAuthFlow.createdSessionId })
				}
			} else {
				setIsLoading(false)
			}
		} catch (error) {
			console.log(error)
			setIsLoading(false)
		}
	}

	useEffect(() => {
		WebBrowser.warmUpAsync()

		return () => {
			WebBrowser.coolDownAsync()
		}
	}, [])
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Welcome to Diary App 42</Text>
			<Text style={styles.simpleText}>Please, chose one way to Join in!</Text>
			<View style={styles.order}>
				<Button icon='logo-google' icolor="#fff" title="Sign in with Google" txcolor="#fff" bgcolor="#3369e8" loadcolor="#fff" onPress={onGoogleSignIn} isLoading={isLoading}/>
				<Button icon='logo-github' icolor='#fff' title="Sign in with GitHub" txcolor="#fff" bgcolor='#000' loadcolor="#fff" onPress={onGitHUbSignIn} isLoading={isLoading}/>
			</View>
			<Text style={styles.creditText}>feat by vgomes-p</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 32,
		justifyContent: 'center',
		alignItems: 'center',
		gap: 0,
	},
	order: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		paddingBottom: 30,
		paddingTop: 30,
		gap: 5,
	},
	title: {
		fontSize: 27,
		fontWeight: 'bold',
	},
	simpleText: {
		fontSize: 18,
	},
	creditText: {
		fontSize: 10,
	},
})