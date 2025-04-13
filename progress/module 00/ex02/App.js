import React from "react";
import { View, StyleSheet, Text, useWindowDimensions } from 'react-native';
import AppBar from "./AppBar";
import { ExpressionInput, ResultOutput } from './components/HandleData';
import ButtonPanel from './components/ButtonPanel';

const App = () => {
	const { width, height } = useWindowDimensions();
	const isLandscape = width > height;
	const expression = "0 (expression)";
	const result = "0 (result)";

	const handleButtonPress = (button) => {
		console.log(`Button pressed: ${button}`);
	};

	return (
		<View style={[styles.container, {width, height}]}>
			<AppBar />
			{isLandscape ? (
				<View style={styles.landContent}>
					<View style={styles.leftContainer}>
						<View><Text style={styles.simpleText}>  History:</Text></View>
						<Text style={styles.simpleText}>  Result:</Text>
						<ResultOutput result={result} />
					</View>
					<View style={styles.rightContainer}>
						<ExpressionInput expression={expression} />
						<ButtonPanel onPress={handleButtonPress}/>
					</View>
				</View>
			) : (
				<>
					<View><Text style={styles.simpleText}>History:</Text></View>
					<ExpressionInput expression={expression} />
					<Text style={styles.simpleText}>Result:</Text>
					<ResultOutput result={result} />
					<ButtonPanel onPress={handleButtonPress} />
				</>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
		backgroundColor: '#011c02',
	},
	landContent: {
		flex: 1,
		flexDirection: 'row',
	},
	leftContainer: {
		flex: 1,
		padding: 10,
	},
	rightContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	historyContainer: {
		maxHeight: 350,
		borderBottomWidth: 1,
		borderBottomColor: '#007006',
	},
	historyItem: {
		alignItems: 'flex-end',
		marginBottom: 5,
	},
	historyExpresion: {
		fontSize: 22,
		color: "#ffc759",
		fontWeight: "bold",
	},
	historyResult: {
		fontSize: 18,
		color: "#ffc759",
	},
	simpleText: {
		fontSize: 15,
		color: "#469c4b",
		marginLeft: 5,
		opacity: 0.8,
		fontWeight: "bold",
	},
});

export default App;