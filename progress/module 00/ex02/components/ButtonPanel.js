import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ButtonPanel = ({ onPress }) => {
	const buttons = [
		['7', '8', '9', 'C', 'AC'],
		['4', '5', '6', '+', '-'],
		['1', '2', '3', '×', '÷'],
		['0', '.', '00', '=', 'clsHis'],
	];

	return (
		<View style={styles.constainer}>
			{buttons.map((row, index) => (
				<View key={index} style={styles.row}>
					{row.map((button) => (
						<TouchableOpacity
							key={button}
							style={styles.button}
							onPress={() => onPress(button)}
						>
							<Text style={styles.buttonText}>{button}</Text>
						</TouchableOpacity>
					))}
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	constainer: {
		flexDirection: 'column',
		justifyContent: 'space-evenly',
		marginTop: 20,
		marginBottom: 25,
		marginVertical: 5,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	button: {
		width: 70,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#004f04',
		borderRadius: 20,
		margin: 3,
	},
	buttonText: {
		fontSize: 20,
		color: '#ffc759',
		fontWeight: 'bold',
	},
});

export default ButtonPanel;