import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { db } from "../../services/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export function EntriesList() {
	const { user } = useUser();
	const [entries, setEntries] = useState<
		{ id: string; title: string; date: any; feeling: string; content: string }[]
	>([]);
	const navigation = useNavigation();

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
				where("userEmail", "==", user.primaryEmailAddress.emailAddress),
				orderBy("date", "desc")
			);
			const unsubscribe = onSnapshot(
				q,
				(snapshot) => {
					const entriesData = snapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}));
					setEntries(entriesData);
				},
				(error) => {
					console.error("Error fetching entries:", error);
				}
			);
			return () => unsubscribe();
		}
	}, [user]);

	const truncateTitle = (title: string, maxLength: number) => {
		if (title.length > maxLength) {
			return title.substring(0, maxLength - 3) + "...";
		}
		return title;
	};

	return (
		<FlatList
			data={entries}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => (
				<TouchableOpacity
					style={styles.boxes}
					onPress={() => navigation.navigate("(auth)/entry-details", { entry: item })}
				>
					<View style={styles.container}>
						<Text style={{ fontSize: 18, marginRight: 5 }}>
							{feelingIcons[item.feeling] || "😐"}
						</Text>
						<Text style={{ fontSize: 16 }}>{truncateTitle(item.title, 30)}</Text>
					</View>
					<Text style={styles.text}>
						{new Date(item.date.toDate()).toLocaleDateString()}
					</Text>
				</TouchableOpacity>
			)}
			ListEmptyComponent={<Text style={{ padding: 10 }}>No entries found.</Text>}
		/>
	);
};

const styles = StyleSheet.create({
	boxes: {
		backgroundColor: 'white',
		padding: 10,
		borderWidth: 2,
		borderRadius: 9,
		margin: 2,
	},
	container: {
		flexDirection: "row",
		alignItems: "center",
	},
	text: {
		fontSize: 14,
		color: "#666",
	},
});