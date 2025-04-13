import { createNavigationContainerRef } from "@react-navigation/native";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		width: '50%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 7,
		padding: 9,
		borderRadius: 9,
		backgroundColor:'black',
	},
	icon: {
		fontSize: 18,
		color: 'white',
	},
	text: {
		fontSize: 16,
		color: 'white'
	},
})