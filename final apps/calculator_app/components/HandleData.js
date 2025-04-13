import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

export const ExpressionInput = ({ expression }) => {
	return (
		<View style={styles.container}>
			<View style={styles.expressionContainer}>
				<TextInput
					style={styles.expressionInput}
					value={expression ? expression : '0'}
					keyboardType="numeric"
					editable={false}
				/>
			</View>
		</View>
	);
};

export const ResultOutput = ({ result }) => {
	return (
		<View style={styles.container}>
			<View style={styles.resultContainer}>
				<Text style={styles.resultText}>
					{result ? result : '0'}
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'column',
	},
	expressionContainer: {
		width: '100%',
		alignItems: 'center',
		marginBottom: 5,
		flexGrow: 1,
		borderBottomWidth: 2,
		borderBottomColor: '#007006',
	},
	expressionInput: {
		width: '100%',
		height: 60,
		marginRight: 5,
		fontSize: 35,
		textAlign: 'right',
		color: "#ffc759",
	},
	resultContainer: {
		width: '100%',
		height: 50,
		justifyContent: 'center',
		alignItems: 'flex-end',
		borderBottomWidth: 0.8,
		borderBottomColor: '#007006',
	},
	resultText: {
		fontSize: 30,
		marginRight: 5,
		color: "#ffc759",
	},
});
