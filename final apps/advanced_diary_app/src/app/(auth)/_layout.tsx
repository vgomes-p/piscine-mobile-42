import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AuthLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: "blue",
				tabBarInactiveTintColor: "grey",
				tabBarStyle: {
					backgroundColor: "white",
					borderTopWidth: 1,
					borderTopColor: "#000",
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					tabBarLabel: "Profile",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="person" color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="agenda"
				options={{
					tabBarLabel: "Agenda",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="calendar" color={color} size={size} />
					),
				}}
			/>
		</Tabs>
	);
}