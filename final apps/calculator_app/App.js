import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text, useWindowDimensions } from 'react-native';
import AppBar from "./AppBar";
import { ExpressionInput, ResultOutput } from './components/HandleData';
import ButtonPanel from './components/ButtonPanel';

const App = () => {
	const [expression, setExpression] = useState('');
	const [result, setResult] = useState('');
	const [resultDisplayed, setResultDisplayed] = useState(false);
	const [history, setHistory] = useState([]);
	const { width, height } = useWindowDimensions();

	const isLandscape = width > height;

	const handleButtonPress = (button) => {
		console.log(`Button pressed: ${button}`);
		const operators = ['+', '-', '×', '÷'];
		const operatorsLess = ['+', '×', '÷'];
		const operatorMap = {'×' : '*', '÷' : '/'};

		if (expression === "Error" && button !== 'AC' && button !== 'C') {
			setExpression(button);
			setResult('');
			setResultDisplayed(false);
			return;
		}

		if (expression === "Error" && button === 'C') {
			setExpression('');
			setResult('');
			setResultDisplayed(false);
			return;
		}

		if (expression === "Error" && button === '=' && button === operators) {
			setExpression(button);
			setResult('');
			setResultDisplayed(false);
			return;
		}

		if (button === 'AC') {
			setExpression('');
			setResult('');
			setResultDisplayed(false);
		} else if (button === 'C') {
			setExpression(expression.slice(0, -1));
		} else if (button === '=') {
			try {
				if (expression === '') return;
				let modExpression = expression.replace(/[×÷]/g, match => operatorMap[match]);
				const computedResult = eval(modExpression).toString();
				setResult(computedResult);
				setResultDisplayed(true);
				setHistory([...history, { expression, result: computedResult }]);
			} catch (e) {
				setExpression('Error');
				setResult('');
			}
		} else if (button === 'clsHis') {
			setHistory([]);
		} else {
			let newExpression = expression;
			if (operatorsLess.includes(button) && (expression === '' || operatorsLess.includes(expression.slice(-1)))) {
				newExpression = '0' + button;
			} else if (button === '-' && expression.slice(-1) === '-') {
				return;
			} else {
				if (resultDisplayed) {
					if (operators.includes(button)) {
						newExpression = result + button;
					} else {
						newExpression = button;
					}
					setResultDisplayed(false);
				} else {
					newExpression += button;
				}
			}
			setExpression(newExpression);
		}
	};


	return (
		<View style={[styles.container, {width, height}]}>
			<AppBar />
			{isLandscape ? (
				<View style={styles.landContent}>
					<View style={styles.leftContainer}>
						<View><Text style={styles.simpleText}>  History:</Text></View>
						<ScrollView style={styles.historyContainer}>
							{history.map((item, index) => (
							<View key={index} style={styles.historyItem}>
								<Text style={styles.historyExpresion}>{item.expression}</Text>
								<Text style={styles.historyResult}>={item.result}</Text>
							</View>
							))}
						</ScrollView>
						<Text style={styles.simpleText}>  Result:</Text>
						<ResultOutput result={result} />
					</View>
					<View style={styles.rightContainer}>
						<ExpressionInput expression={expression} />
						<ButtonPanel onPress={handleButtonPress} />
					</View>
				</View>
			) : (
				<>
					<View><Text style={styles.simpleText}>History:</Text></View>
					<ScrollView style={styles.historyContainer}>
						{history.map((item, index) => (
							<View key={index} style={styles.historyItem}>
								<Text style={styles.historyExpresion}>{item.expression}</Text>
								<Text style={styles.historyResult}>={item.result}</Text>
							</View>
						))}
					</ScrollView>
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