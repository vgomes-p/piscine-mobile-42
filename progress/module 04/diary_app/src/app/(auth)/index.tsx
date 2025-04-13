import { View, Text, StyleSheet, Image, SafeAreaView, StatusBar } from "react-native";
import { Button } from "../components/Button";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useNavigation } from "expo-router";
import { EntriesList } from "../components/EntriesList";
import { ImageBackground } from "react-native";

import backgroundImage from '../../../assets/images/top_profile.png'

export default function Profile() {
	const { user } = useUser()
	const { signOut } = useAuth()
	const navigation = useNavigation();

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<StatusBar barStyle="default" />
			<ImageBackground source={backgroundImage} style={styles.orderTopProfile} resizeMode="cover">
				<Image source={{ uri: user?.imageUrl }} style={styles.profileImage} />
				<View style={{ gap: 5,}}>
					<Text style={styles.text}> Hello, {user?.firstName}!</Text>
					<Button icon="exit" icolor="#fff" title="exit" txcolor="#fff" loadcolor="#fff" bgcolor="red" onPress={() => signOut()} />
				</View>
			</ImageBackground>
			<View style={styles.container}>
				<Button
					icon="add"
					icolor="#fff"
					title="Create New Mood Check"
					txcolor="#fff"
					bgcolor="blue"
					loadcolor="#fff"
					onPress={() => navigation.navigate("(auth)/new-entry")}
				/>
				<EntriesList />
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 45,
		justifyContent: 'center',
		alignItems: 'center',
		gap: 12,
	},
	orderTopProfile: {
		paddingTop: 25,
		paddingLeft: 25,
		paddingBottom: 25,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		borderBottomWidth: 1,
		borderBottomColor: 'black',
	},
	text: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#000',
	},
	profileImage: {
		width: 92,
		height: 92,
		borderRadius: 50,
		borderWidth: 2,
		borderColor: "brown",
	},
})