import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

export const CitiesSuggestionList = ({ suggestions, onSelect }) => {
	if (!suggestions || suggestions.length === 0) return null;

	return (
		<ScrollView style={styles.list} keyboardShouldPersistTaps='handled'>
			{suggestions.map((item) => (
				<TouchableOpacity
					key={item.id.toString()}
					style={styles.item}
					onPress={() => { onSelect(item); }}
				>
					<Text style={styles.text}>
						{item.name}, {item.admin1}, {item.country}
					</Text>
				</TouchableOpacity>
			))}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	list: {
		backgroundColor: '#3d167a',
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		width: '90%',
		maxHeight: 200,
		position: 'absolute',
		top: 90,
		left: '5%',
		zIndex: 1000,
	},
	item: {
		padding: 15,
		borderTopWidth: 1,
		borderTopColor: '#edcfff',
	},
	text: {
		fontSize: 16,
		color: '#edcfff',
	},
});