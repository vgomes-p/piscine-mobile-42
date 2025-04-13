import React from "react";
import { View, Text, StyleSheet, Alert, SafeAreaView, StatusBar } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Button } from "../components/Button";
import { db } from "../../services/firebase";
import { deleteDoc, doc } from "firebase/firestore";

export default function EntryDetails() {
	const route = useRoute();
	const navigation = useNavigation();
	const { entry } = route.params;

	const giveup = () => {
		navigation.goBack();
	};

	const feelingIcons = {
		"very good": "😊",
		good: "🙂",
		okay: "😐",
		bad: "😕",
		awful: "😢",
	};

	const deleteEntry = async () => {
		Alert.alert(
			"Delete Entry",
			"Are you sure you want to delete this entry?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						try {
							await deleteDoc(doc(db, "entries", entry.id));
							console.log("Entrada deletada:", entry.id);
							navigation.goBack();
						} catch (error) {
							console.error("Erro ao deletar entrada:", error);
							Alert.alert("Error", "Failed to delete entry.");
						}
					},
				},
			]
		);
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<StatusBar barStyle="default" />
			<View style={styles.container}>
				<Text style={styles.title}>{entry.title}</Text>
				<Text style={styles.date}>
					{new Date(entry.date.toDate()).toLocaleDateString()}
				</Text>
				<Text style={styles.text}>Your mood of the day:</Text>
				<Text style={styles.feeling}>
					Feeling {entry.feeling} {feelingIcons[entry.feeling] || "😐"}
				</Text>
				<Text style={styles.text}>Your thoughts:</Text>
				<Text style={styles.content}>{entry.content}</Text>
			</View>
			<View style={styles.order}>
				<Button
					icon="trash"
					icolor="#fff"
					title="Delete"
					txcolor="#fff"
					bgcolor="red"
					loadcolor="#fff"
					onPress={deleteEntry}
				/>
				<Button
					icon="return-down-back"
					icolor="#fff"
					title="Go back to profile"
					txcolor="#fff"
					bgcolor="blue"
					loadcolor="#fff"
					onPress={giveup}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#fff",
		justifyContent: 'flex-start',
		paddingVertical: 50,
	},
	order: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 15,
		width: '100%',
		paddingLeft: 10,
		paddingRight: 10,
		gap: 5,
	},
	text: {
		textAlign: 'center',
		marginBottom: 3,
		fontSize: 13,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		borderBottomWidth: 1,
		marginBottom: 5,
		textAlign: 'center'
	},
	date: {
		fontSize: 16,
		color: "#666",
		marginBottom: 10,
		textAlign: 'center',
	},
	feeling: {
		fontSize: 18,
		marginBottom: 15,
		borderWidth: 1,
		borderRadius: 9,
		padding: 6,
	},
	content: {
		fontSize: 18,
		borderWidth: 1,
		borderRadius: 9,
		padding: 6,
		lineHeight: 24,
		marginBottom: 20,
	},
});