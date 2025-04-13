import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const AppBar = () => (
	<SafeAreaView style={styles.safeArea}>
		<View style={styles.appBar}>
			<Text style={styles.appBarTitle}>Calculator</Text>
		</View>
	</SafeAreaView>
);

const styles = StyleSheet.create({
	safeArea: {
		backgroundColor: '#d15700',
	},
	appBar: {
		width: '100%',
		height: 60,
		backgroundColor: '#004f04',
		justifyContent: 'center',
		alignItems: 'flex-start',
	},
	appBarTitle: {
		marginTop: 20,
		color: '#ffc759',
		marginLeft: 10,
		fontSize: 25,
		fontWeight: 'bold',
	},
});

export default AppBar;