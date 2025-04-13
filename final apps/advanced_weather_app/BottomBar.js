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
				disabled={isSearchFocused}
			>
				<Icon name="map-marker" size={24} color={selectedTab === 'Currently' ? '#fff2e3' : '#fff2e3'} />
				<Text style={[styles.bottomButtonText, selectedTab === 'Currently' && styles.activeText]}>
					Currently
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.bottomButton, selectedTab === 'Today' && styles.activeButton]}
				onPress={() => handleTabPress('Today')}
				disabled={isSearchFocused}
			>
				<Icon name="calendar-check-o" size={24} color={selectedTab === 'Today' ? '#fff2e3' : '#fff2e3'} />
				<Text style={[styles.bottomButtonText, selectedTab === 'Today' && styles.activeText]}>
					Today
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.bottomButton, selectedTab === 'Weekly' && styles.activeButton]}
				onPress={() => handleTabPress('Weekly')}
				disabled={isSearchFocused}
			>
				<Icon name="calendar" size={24} color={selectedTab === 'Weekly' ? '#fff2e3' : '#fff2e3'} />
				<Text style={[styles.bottomButtonText, selectedTab === 'Weekly' && styles.activeText]}>
					Weekly
				</Text>
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
		height: 75,
		backgroundColor: '#17003d',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	bottomButton: {
		alignItems: 'center',
		justifyContent: 'center',
		color: '#fff2e3',
		padding: 10,
	},
	bottomButtonText: {
		color: '#fff2e3',
		fontSize: 15,
		fontWeight: 'bold',
	},
	activeButton: {
		backgroundColor: '#3d167a',
		borderRadius: 10,
	},
	activeText: {
		color: '#fff2e3',
	},
});