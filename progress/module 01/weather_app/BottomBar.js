import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export const BottomBar = ({ selectedTab, setSelectedTab, isSearchFocused }) => {

	const handleTabPress = (tab) => {
		if (!isSearchFocused) {
			setSelectedTab(tab);
		}
	};
	return (
	<View style={styles.bottomAppBar}>
		<TouchableOpacity 
			style={[styles.bottomButton, selectedTab === 'Currently' && styles.activeButton]}
			onPress={() => handleTabPress('Currently')}
		>
			<Icon name="map-marker" size={24} color={selectedTab === 'Currently' ? '#ffd700' : '#fff'} />
			<Text style={[styles.bottomButtonText, selectedTab === 'Currently' && styles.activeText]}>Currently</Text>
		</TouchableOpacity>
		<TouchableOpacity 
			style={[styles.bottomButton, selectedTab === 'Today' && styles.activeButton]}
			onPress={() => handleTabPress('Today')}
		>
			<Icon name="calendar-check-o" size={24} color={selectedTab === 'Today' ? '#ffd700' : '#fff'} />
			<Text style={[styles.bottomButtonText, selectedTab === 'Today' && styles.activeText]}>Today</Text>
		</TouchableOpacity>
		<TouchableOpacity 
			style={[styles.bottomButton, selectedTab === 'Weekly' && styles.activeButton]}
			onPress={() => handleTabPress('Weekly')}
		>
			<Icon name="calendar" size={24} color={selectedTab === 'Weekly' ? '#ffd700' : '#fff'} />
			<Text style={[styles.bottomButtonText, selectedTab === 'Weekly' && styles.activeText]}>Weekly</Text>
		</TouchableOpacity>
	</View>
	);
};

const styles = StyleSheet.create({
	bottomAppBar: {
		flexDirection: 'row',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		width: '100%',
		height: 100,
		backgroundColor: '#444',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	bottomButton: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	bottomButtonText: {
		color: '#fff',
		fontSize: 15,
		fontWeight: 'bold',
	},
	activeButton: {
		height: 55,
		width: 55,
		backgroundColor: '#666',
		borderRadius: 10,
	},
	activeText: {
		color: '#ffd700',
		fontWeight: 'black',
	},
});