import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const App = () => {
	const [text, setText] = useState('Module 0 - Ex01');

	const handlePress = () => {
		setText(prevText => (prevText === 'Module 0 - Ex01' ? 'Hello, World!' : 'Module 0 - Ex01'));
	};

	// const handlePress = () => {
	// 	setText(prevText => (prevText === 'Module 0 - Ex01' ? 'Hello, 42 São Paulo!' :
	// 			prevText === 'Hello, 42 São Paulo!' ? 'Hello, Global 42!' :
	// 			prevText === 'Hello, Global 42!' ? 'Hello, World!' :
	// 			'Module 0 - Ex01'));
	// };

	return (
		<View style={style.container}>
			<Text style={style.text}>{text}</Text>
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
