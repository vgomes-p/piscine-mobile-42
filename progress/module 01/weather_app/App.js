import { React, useState } from "react";
import { View, StyleSheet, Text, useWindowDimensions, SafeAreaView, PanResponder } from 'react-native';
import { TopBar } from "./TopBar";
import { BottomBar } from "./BottomBar";

const App = () => {
	const { width, height } = useWindowDimensions();
	const [selectedTab, setSelectedTab] = useState('Currently');
	const [searchText, setSearchText] = useState('');
	const [enterText, setEnterText] = useState('');
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [isGeolocationActive, setIsGeolocationActive] = useState(false);

	const tabs = ['Currently', 'Today', 'Weekly'];

	const panResponder = PanResponder.create({
		onMoveShouldSetPanResponder: (evt, gestureState) => {
			return Math.abs(gestureState.dx) > 20;
		},
		onPanResponderRelease: (evt, gestureState) => {
			if (!isSearchFocused) {
				const currentIndex = tabs.indexOf(selectedTab);
				if (gestureState.dx < -50 && currentIndex > 0) {
					setSelectedTab(tabs[currentIndex - 1]);
				} else if (gestureState.dx > 50 && currentIndex < tabs.length - 1) {
					setSelectedTab(tabs[currentIndex + 1]);
				}
			}
		},
	});

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={[styles.container, {width, height}]} {...panResponder.panHandlers}>
				<TopBar
					searchText={searchText}
					setSearchText={setSearchText}
					enterText={enterText}
					setEnterText={setEnterText}
					isSearchFocused={isSearchFocused}
					setIsSearchFocused={setIsSearchFocused}
					setIsGeolocationActive={setIsGeolocationActive}
				/>
				<View style={styles.content}>
					<Text style={styles.contentText}>{selectedTab}</Text>
					<Text style={styles.searchText}>
						{isGeolocationActive ? 'Geolocation' : searchText}
					</Text>
				</View>
				{!isSearchFocused && (
					<BottomBar
						selectedTab={isSearchFocused ? null : selectedTab}
						setSelectedTab={setSelectedTab}
						isSearchFocused={isSearchFocused}
					/>
				)}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	container: {
		flex: 1,
	},
	content: {
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center',
	},
	contentText: {
		color: '#000',
		fontSize: 24,
		fontWeight: 'bold',
	},
	searchText: {
		color: '#000',
		fontSize: 24,
		fontWeight: '',
		marginTop: 2,
	},
});

export default App;