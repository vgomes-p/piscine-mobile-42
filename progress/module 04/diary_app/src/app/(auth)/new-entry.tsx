import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { Button } from "../components/Button";
import { useUser } from "@clerk/clerk-expo";
import { db } from "../../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function NewEntry() {
	const { user } = useUser();
	const [title, setTitle] = useState("");
	const [feeling, setFeeling] = useState("okay");
	const [content, setContent] = useState("");
	const navigation = useNavigation();

	const feelings = [
		{ title: "very good", emoji: "😊" },
		{ title: "good", emoji: "🙂" },
		{ title: "okay", emoji: "😐" },
		{ title: "bad", emoji: "😕" },
		{ title: "awful", emoji: "😢" },
	];

	const createEntry = async () => {
		if (!title || !content) {
			Alert.alert("Error", "Please fill in all fields.");
			return;
		}
		try {
			await addDoc(collection(db, "entries"), {
				userEmail: user?.primaryEmailAddress?.emailAddress,
				date: serverTimestamp(),
				title,
				feeling,
				content,
			});
			Alert.alert("Success", "Entry created successfully!");
			navigation.goBack();
		} catch (error) {
			console.error("Error creating entry:", error);
			Alert.alert("Error", "Failed to create entry.");
		}
	};

	const giveup = () => {
		navigation.goBack();
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<StatusBar barStyle="default" />
			<View style={styles.container}>
				<Text style={styles.label}>Title</Text>
				<TextInput
					style={styles.input}
					value={title}
					onChangeText={setTitle}
					placeholder="Enter title"
				/>
				<Text style={styles.label}>How are you feeling today?</Text>
				<View style={styles.feelingsContainer}>
					{feelings.map((feel) => (
						<TouchableOpacity
							key={feel.title}
							style={[
								styles.feelingButton,
								feeling === feel.title ? styles.feelingButtonSelected : null,
							]}
							onPress={() => setFeeling(feel.title)}
						>
							<Text
								style={[
									styles.feelingText,
									feeling === feel.title ? styles.feelingTextSelected : null,
								]}
							>
								{feel.emoji}
							</Text>
						</TouchableOpacity>
					))}
				</View>
				<Text style={styles.label}>What's on your mind?</Text>
				<TextInput
					style={[styles.input, { height: 100 }]}
					value={content}
					onChangeText={setContent}
					placeholder="Write your thoughts..."
					multiline
				/>
			</View>
			<View style={styles.order}>
				<Button
					icon="return-down-back"
					icolor="#fff"
					title="Go back to profile"
					txcolor="#fff"
					bgcolor="blue"
					loadcolor="#fff"
					onPress={giveup}
				/>
				<Button
					icon="checkmark"
					icolor="#fff"
					title="Save Mood"
					txcolor="#fff"
					bgcolor="green"
					loadcolor="#fff"
					onPress={createEntry}
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
	label: {
		fontSize: 16,
		marginBottom: 5,
	},
	input: {
		textAlignVertical: 'top',
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		padding: 10,
		marginBottom: 15,
	},
	feelingsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		marginBottom: 15,
	},
	feelingButton: {
		padding: 10,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		margin: 5,
		width: "15%",
		alignItems: "center",
		justifyContent: "center",
	},
	feelingButtonSelected: {
		backgroundColor: "#3369e8",
		borderColor: "#3369e8",
	},
	feelingText: {
		fontSize: 20,
		color: "#000",
	},
	feelingTextSelected: {
		color: "#fff",
	},
});