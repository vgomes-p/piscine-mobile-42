import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const App = () => {
	const handlePress = () => {
		console.log('button pressed');
	};

	return (
		<View style={style.container}>
			<Text style={style.text}>Module 0 - Ex00</Text>
			<Button title="Click here" onPress={handlePress} />
		</View>
	);
};

const style = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	text: {
		fontSize: 20,
		marginBottom: 20,
	},
});

export default App;