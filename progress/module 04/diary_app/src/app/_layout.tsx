import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { router, Slot } from "expo-router";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "./storage/tokenCache";

const PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string

function InitialLayout() {
	const {isSignedIn, isLoaded } = useAuth()

	useEffect(() => {
		if (!isLoaded) return

		if (isSignedIn){
			router.replace("(auth)")
		} else {
			router.replace("(public)")
		}
	}, [isSignedIn])

	return isLoaded ? <Slot /> : (<ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}/>)
}

export default function Layout() {
	return (
		<ClerkProvider publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
			<InitialLayout />
		</ClerkProvider>
	)
}

