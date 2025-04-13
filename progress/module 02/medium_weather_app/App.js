import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, useWindowDimensions, SafeAreaView, PanResponder } from 'react-native';
import { TopBar } from "./TopBar";
import { BottomBar } from "./BottomBar";
import { TabContent } from "./TabContent";
import * as Location from 'expo-location';

const App = () => {
	const { width, height } = useWindowDimensions();
	const [selectedTab, setSelectedTab] = useState('Currently');
	const [searchText, setSearchText] = useState('');
	const [enterText, setEnterText] = useState('');
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [isGeolocationActive, setIsGeolocationActive] = useState(false);
	const [location, setLocation] = useState(null);
	const [locationPermission, setLocationPermission] = useState(null);
	const [locationServicesEnabled, setLocationServicesEnabled] = useState(true);
	const [weatherData, setWeatherData] = useState(null);
	const [lastSearch, setLastSearch] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);

	const tabs = ['Currently', 'Today', 'Weekly'];

	const fetchReverseGeocode = async (latitude, longitude) => {
		try {
			console.log("Reversing geocodification...");
			const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
			const response = await fetch(url, {
				headers: {
					'User-Agent': 'Medium_Weather_App/1.0 (vgomes-p@student.42sp.org.br)',
				},
			});
			const data = await response.json();
			console.log("Geocoding data:", data);
			if (data && data.address) {
				const { city, town, village, state, country } = data.address;
				const locationName = city || town || village || "Unknown Location";
				return {
					name: locationName,
					admin1: state || "",
					country: country || "",
					latitude,
					longitude,
				};
			}
			return { name: "Unknown Location", admin1: "", country: "", latitude, longitude };
		} catch (error) {
			console.error("Error on reversing codification:", error);
			return { name: "Unknown Location", admin1: "", country: "", latitude, longitude };
		}
	};

	const fetchWeatherData = async (latitude, longitude, cityData) => {
		try {
			console.log("Searching for weather datas");
			const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,windspeed_10m&hourly=temperature_2m,weathercode,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
			const response = await fetch(url);
			const data = await response.json();
			console.log("Weather data received:", data);
			setWeatherData(data);
			setLastSearch({ latitude, longitude, cityData });
			setErrorMessage(null);
		} catch (error) {
			console.error("Error fetching weather data:", error);
			setErrorMessage("Connection error: Unable to fetch weather data\nPlease, check your internet connection.");
		}
	};

	const requestLocation = async () => {
		try {
			const servicesEnabled = await Location.hasServicesEnabledAsync();
			setLocationServicesEnabled(servicesEnabled);
			if (!servicesEnabled) {
				setLocation(null);
				return;
			}
			const { status } = await Location.requestForegroundPermissionsAsync();
			setLocationPermission(status);
			if (status === 'granted') {
				const loc = await Location.getCurrentPositionAsync({
					accuracy: Location.Accuracy.Balanced,
				});
				setLocation(loc.coords);
				const cityData = await fetchReverseGeocode(loc.coords.latitude, loc.coords.longitude);
				fetchWeatherData(loc.coords.latitude, loc.coords.longitude, cityData);
			} else {
				setLocation(null);
			}
		} catch (error) {
			console.warn("Error on getting location:", error);
			setLocation(null);
		}
	};

	const updateLocation = async () => {
		if (locationPermission === 'granted') {
			try {
				console.log("Getting actual location...");
				const loc = await Location.getCurrentPositionAsync({
					accuracy: Location.Accuracy.Balanced,
				});
				console.log("Actual Location found:", loc.coords);
				setLocation(loc.coords);
				const cityData = await fetchReverseGeocode(loc.coords.latitude, loc.coords.longitude);
				fetchWeatherData(loc.coords.latitude, loc.coords.longitude, cityData);
			} catch (error) {
				console.warn("Error on updating location:", error);
				setLocation(null);
			}
		} else {
			requestLocation();
		}
	};

	const handleCitySelect = (city) => {
		if (city) {
			fetchWeatherData(city.latitude, city.longitude, city);
		} else {
			setErrorMessage("Error: Location not found.\nPlease enter a valid location.")
		}
	};

	useEffect(() => {
		requestLocation();
	}, []);

	const panResponder = PanResponder.create({
		onMoveShouldSetPanResponder: (evt, gestureState) => {
			if (isSearchFocused) return false;
			return Math.abs(gestureState.dx) > 20;
		},
		onPanResponderRelease: (evt, gestureState) => {
			if (!isSearchFocused) {
				const currentIndex = tabs.indexOf(selectedTab);
				if (gestureState.dx > 50 && currentIndex > 0) {
					setSelectedTab(tabs[currentIndex - 1]);
				} else if (gestureState.dx < -50 && currentIndex < tabs.length - 1) {
					setSelectedTab(tabs[currentIndex + 1]);
				}
			}
		},
	});

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={[styles.container, { width, height }]} {...panResponder.panHandlers}>
				<TopBar
					searchText={searchText}
					setSearchText={setSearchText}
					enterText={enterText}
					setEnterText={setEnterText}
					isSearchFocused={isSearchFocused}
					setIsSearchFocused={setIsSearchFocused}
					setIsGeolocationActive={setIsGeolocationActive}
					triggerLocationRequest={updateLocation}
					onCitySelect={handleCitySelect}
					setErrorMessage={setErrorMessage}
				/>
				<View style={styles.content}>
					<Text style={styles.contentText}>{selectedTab}</Text>
					{isGeolocationActive && !locationServicesEnabled ? (
						<View>
							<Text style={styles.permText}>Location service is turned off.</Text>
							<Text style={styles.permText}>Please, turn it on!</Text>
						</View>
					) : isGeolocationActive && locationPermission !== 'granted' ? (
						<View>
							<Text style={styles.permText}>Access to location permission is off.</Text>
							<Text style={styles.permText}>Please, allow it in your device settings.</Text>
						</View>
					) : (
						<TabContent
							style={styles.page}
							selectedTab={selectedTab}
							weatherData={weatherData}
							lastSearch={lastSearch}
							errorMessage={errorMessage}
						/>
					)}
				</View>
				{!isSearchFocused && (
					<BottomBar
						selectedTab={selectedTab}
						setSelectedTab={setSelectedTab}
						isSearchFocused={isSearchFocused}
					/>
				)}
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#fff',
	},
	container: {
		flex: 1,
	},
	page: {
		flex: 1,
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	contentText: {
		color: '#000',
		fontSize: 24,
		fontWeight: 'bold',
	},
	permText: {
		color: '#ff6666',
		fontSize: 18,
		textAlign: 'center',
		marginTop: 5,
	},
});

export default App;