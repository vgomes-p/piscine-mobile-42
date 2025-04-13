import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, SafeAreaView, StatusBar, ImageBackground } from "react-native";
import { Button } from "../components/Button";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useNavigation } from "expo-router";
import { EntriesList } from "../components/EntriesList";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebase";

import backgroundImage from "../../../assets/images/top_profile.png";

export default function Profile() {
	const { user } = useUser();
	const { signOut } = useAuth();
	const navigation = useNavigation();

	const [totalEntries, setTotalEntries] = useState(0);
	const [feelingPercentages, setFeelingPercentages] = useState({
		"very good": 0,
		good: 0,
		okay: 0,
		bad: 0,
		awful: 0,
	});

	const feelingIcons = {
		"very good": "😊",
		good: "🙂",
		okay: "😐",
		bad: "😕",
		awful: "😢",
	};

	useEffect(() => {
		if (user && user.primaryEmailAddress?.emailAddress) {
			const q = query(
				collection(db, "entries"),
				where("userEmail", "==", user.primaryEmailAddress.emailAddress)
			);
			const unsubscribe = onSnapshot(q, (snapshot) => {
				const entries = snapshot.docs
					.map((doc) => doc.data())
					.filter((entry) => entry.date != null);
				setTotalEntries(entries.length);

				const feelingCounts = {
					"very good": 0,
					good: 0,
					okay: 0,
					bad: 0,
					awful: 0,
				};

				entries.forEach((entry) => {
					if (entry.feeling in feelingCounts) {
						feelingCounts[entry.feeling]++;
					}
				});

				const percentages = {};
				Object.keys(feelingCounts).forEach((feeling) => {
					percentages[feeling] =
						entries.length > 0
							? Math.round((feelingCounts[feeling] / entries.length) * 100)
							: 0;
				});
				setFeelingPercentages(percentages);
			});
			return () => unsubscribe();
		}
	}, [user]);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<StatusBar barStyle="default" />
			<ImageBackground
				source={backgroundImage}
				style={styles.orderTopProfile}
				resizeMode="cover"
			>
				<Image source={{ uri: user?.imageUrl }} style={styles.profileImage} />
				<View style={{ gap: 5 }}>
					<Text style={styles.text}>Hello, {user?.firstName}!</Text>
					<Button
						icon="exit"
						icolor="#fff"
						title="exit"
						txcolor="#fff"
						loadcolor="#fff"
						bgcolor="red"
						onPress={() => signOut()}
					/>
				</View>
			</ImageBackground>
			<View style={styles.statsOrder}>
				<View style={styles.statsContainer}>
					<Text style={styles.statsTitle}>Your Mood Stats</Text>
					<Text style={styles.statsText}>Total Entries: {totalEntries}</Text>
				</View>
				<View style={styles.percentageContainer}>
					{Object.entries(feelingPercentages).map(([feeling, percentage]) => (
						<Text key={feeling} style={styles.percentageText}>
							{feelingIcons[feeling]}: {percentage}%
						</Text>
					))}
				</View>
			</View>
			<View style={styles.container}>
				<Text style={styles.mainTitle}>Your Moods:</Text>
				<EntriesList />
				<Button
					icon="add"
					icolor="#fff"
					title="Create New Mood Check"
					txcolor="#fff"
					bgcolor="blue"
					loadcolor="#fff"
					onPress={() => navigation.navigate("new-entry")}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 25,
		gap: 12,
	},
	orderTopProfile: {
		paddingTop: 25,
		paddingLeft: 25,
		paddingBottom: 25,
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		borderBottomWidth: 1,
		borderBottomColor: "black",
	},
	text: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#000",
	},
	mainTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#000",
	},
	profileImage: {
		width: 92,
		height: 92,
		borderRadius: 50,
		borderWidth: 2,
		borderColor: "brown",
	},
	statsContainer: {
		width: "95%",
		padding: 15,
		borderWidth: 1,
		backgroundColor: "#edeef0",
		borderRadius: 9,
		marginBottom: 10,
		alignItems: "center",
	},
	statsTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 5,
	},
	statsText: {
		fontSize: 17,
	},
	percentageContainer: {
		width: "95%",
		flexDirection: "row",
		justifyContent: "space-around",
		padding: 15,
		borderWidth: 1,
		backgroundColor: "#edeef0",
		borderRadius: 9,
		marginBottom: 10,
		gap: 10,
	},
	percentageText: {
		fontSize: 16,
		marginVertical: 2,
	},
	statsOrder: {
		alignItems: "center",
		marginTop: 10,
	},
});