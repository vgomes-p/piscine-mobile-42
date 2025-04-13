import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { db } from "../../services/firebase";
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView, StatusBar } from "react-native";

const formatDateToLocal = (timestamp) => {
	if (!timestamp || !timestamp.toDate) return null;
	const date = timestamp.toDate();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

const getTodayLocal = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

export default function Agenda() {
	const { user } = useUser();
	const navigation = useNavigation();
	const [selectedDate, setSelectedDate] = useState(getTodayLocal()); // Usar data local
	const [entries, setEntries] = useState([]);
	const [markedDates, setMarkedDates] = useState({});

	const feelingIcons = {
		"very good": "😊",
		good: "🙂",
		okay: "😐",
		bad: "😕",
		awful: "😢",
	};

	useEffect(() => {
		if (user && user.primaryEmailAddress?.emailAddress) {
			const allEntriesQuery = query(
				collection(db, "entries"),
				where("userEmail", "==", user.primaryEmailAddress.emailAddress)
			);

			const unsubscribeAll = onSnapshot(
				allEntriesQuery,
				(snapshot) => {
					const dates = {};
					snapshot.docs.forEach((doc) => {
						const data = doc.data();
						const dateStr = formatDateToLocal(data.date);
						if (dateStr) {
							dates[dateStr] = {
								marked: true,
								dotColor: "blue",
							};
						}
					});
					setMarkedDates(dates);
				},
				(error) => {
					console.error("Error fetching all entries for calendar:", error);
				}
			);

			if (selectedDate) {
				const [year, month, day] = selectedDate.split('-').map(Number);
				const selected = new Date(year, month - 1, day);

				const startOfDay = new Date(selected);
				startOfDay.setHours(0, 0, 0, 0);
				const endOfDay = new Date(selected);
				endOfDay.setHours(23, 59, 59, 999);

				const startTimestamp = Timestamp.fromDate(startOfDay);
				const endTimestamp = Timestamp.fromDate(endOfDay);

				console.log("Querying entries for:", {
					email: user.primaryEmailAddress.emailAddress,
					start: startTimestamp.toDate().toISOString(),
					end: endTimestamp.toDate().toISOString(),
				});

				const q = query(
					collection(db, "entries"),
					where("userEmail", "==", user.primaryEmailAddress.emailAddress),
					where("date", ">=", startTimestamp),
					where("date", "<=", endTimestamp)
				);

				const unsubscribe = onSnapshot(
					q,
					(snapshot) => {
						const entriesData = snapshot.docs.map((doc) => ({
							id: doc.id,
							...doc.data(),
						}));
						console.log("Entries found:", entriesData);
						setEntries(entriesData);
					},
					(error) => {
						console.error("Error fetching entries for date:", error);
					}
				);

				return () => {
					unsubscribe();
					unsubscribeAll();
				};
			}

			return () => unsubscribeAll();
		}
	}, [user, selectedDate]);

	const truncateTitle = (title: string, maxLength: number) => {
		if (title.length > maxLength) {
			return title.substring(0, maxLength - 3) + "...";
		}
		return title;
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<StatusBar barStyle="default" />
			<View style={styles.container}>
				<Text style={styles.title}>Your Mood Calendar</Text>
				<Calendar
					current={selectedDate}
					onDayPress={(day) => setSelectedDate(day.dateString)}
					markedDates={{
						...markedDates,
						[selectedDate]: {
							...markedDates[selectedDate],
							selected: true,
							selectedColor: "blue",
						},
					}}
					theme={{
						todayTextColor: "red",
						arrowColor: "blue",
					}}
				/>
				<View style={styles.entriesContainer}>
					<Text style={styles.entriesTitle}>
						Moods for {selectedDate.split('-').reverse().join('/')}
					</Text>
					<FlatList
						data={entries}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<TouchableOpacity
								style={styles.entryItem}
								onPress={() => navigation.navigate("entry-details", { entry: item })}
							>
								<View style={styles.entryContent}>
									<Text style={{ fontSize: 18, marginRight: 5 }}>
										{feelingIcons[item.feeling] || "😐"}
									</Text>
									<Text style={{ fontSize: 16 }}>
										{truncateTitle(item.title, 30)}
									</Text>
								</View>
								<Text style={styles.entryDate}>
									{item.date ? new Date(item.date.toDate()).toLocaleTimeString() : "No time"}
								</Text>
							</TouchableOpacity>
						)}
						ListEmptyComponent={
							<Text style={{ padding: 10 }}>No entries for this date.</Text>
						}
					/>
				</View>
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
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10,
		textAlign: "center",
	},
	entriesContainer: {
		flex: 1,
		marginTop: 10,
	},
	entriesTitle: {
		fontSize: 18,
		marginBottom: 10,
	},
	entryItem: {
		backgroundColor: "#edeef0",
		padding: 10,
		borderWidth: 1,
		borderRadius: 9,
		marginVertical: 3,
	},
	entryContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	entryDate: {
		fontSize: 14,
		color: "#666",
	},
});