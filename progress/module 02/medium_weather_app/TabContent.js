import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export const TabContent = ({ selectedTab, weatherData, lastSearch, errorMessage }) => {
	const weatherCodeToDescription = (code) => {
		const codes = {
			0: "Clear Sky",
			1: "Mainly Clear",
			2: "Partly Cloudy",
			3: "Overcast",
			45: "Fog",
			51: "Light Drizzle",
			61: "Light Rain",
			63: "Moderate Rain",
			65: "Heavy Rain",
			71: "Light Snow",
			73: "Moderate Snow",
			75: "Heavy Snow",
		};
		return codes[code] || "Unknown";
	};

	const renderCityHeader = () => {
		if (!lastSearch) return null;
		const { cityData } = lastSearch;
		return (
			<Text style={styles.locationText}>
				{cityData.name}, {cityData.admin1}, {cityData.country}
			</Text>
		);
	};

	const renderCurrently = () => {
		if (errorMessage) return <Text style={styles.errorText}>{errorMessage}</Text>;
		console.log("weatherData:", weatherData, "lastSearch:", lastSearch);
		if (!weatherData || !lastSearch || !weatherData.current) return <Text>No data available</Text>;
		const { current } = weatherData;
		return (
			<View style={styles.tabContent}>
				{renderCityHeader()}
				<View style={styles.weatherContainer}>
					<Text style={styles.weatherText}>Temperature: {current.temperature_2m}°C</Text>
					<Text style={styles.weatherText}>Weather: {weatherCodeToDescription(current.weathercode)}</Text>
					<Text style={styles.weatherText}>Wind Speed: {current.windspeed_10m} km/h</Text>
				</View>
			</View>
		);
	};

	const renderToday = () => {
		if (errorMessage) return <Text style={styles.errorText}>{errorMessage}</Text>;
		if (!weatherData || !lastSearch || !weatherData.hourly) return <Text>No data available</Text>;
		const { hourly } = weatherData;
		const today = new Date().toISOString().split('T')[0];
		const todayData = hourly.time
			.map((time, index) => ({
				time,
				temp: hourly.temperature_2m[index],
				weather: weatherCodeToDescription(hourly.weathercode[index]),
				wind: hourly.windspeed_10m[index],
			}))
			.filter((item) => item.time.startsWith(today));
		return (
			<View style={styles.tabContent}>
				{renderCityHeader()}
				<ScrollView horizontal={true} style={styles.weatherContainer}>
					{todayData.map((item, index) => (
						<View key={index} style={styles.multiItem}>
							<Text style={styles.weatherText}>{item.time.slice(11, 16)}</Text>
							<Text style={styles.weatherText}>Temp: {item.temp}°C</Text>
							<Text style={styles.weatherText}>{item.weather}</Text>
							<Text style={styles.weatherText}>Wind: {item.wind} km/h</Text>
						</View>
					))}
				</ScrollView>
			</View>
		);
	};

	const renderWeekly = () => {
		if (errorMessage) return <Text style={styles.errorText}>{errorMessage}</Text>;
		if (!weatherData || !lastSearch || !weatherData.daily) return <Text>No data available</Text>;
		const { daily } = weatherData;
		return (
			<View style={styles.tabContent}>
				{renderCityHeader()}
				<ScrollView horizontal={true} style={styles.weatherContainer}>
					{daily.time.map((date, index) => (
						<View key={index} style={styles.multiItem}>
							<Text style={styles.weatherText}>{date}</Text>
							<Text style={styles.weatherText}>Max: {daily.temperature_2m_max[index]}°C</Text>
							<Text style={styles.weatherText}>Min: {daily.temperature_2m_min[index]}°C</Text>
							<Text style={styles.weatherText}>{weatherCodeToDescription(daily.weathercode[index])}</Text>
						</View>
					))}
				</ScrollView>
			</View>
		);
	};

	switch (selectedTab) {
		case 'Currently': return renderCurrently();
		case 'Today': return renderToday();
		case 'Weekly': return renderWeekly();
		default: return <Text>Tab not found</Text>;
	}
};

const styles = StyleSheet.create({
	tabContent: {
		width: '100%',
		padding: 20,
		alignItems: 'center',
	},
	locationText: {
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 15,
		textAlign: "center",
	},
	weatherContainer: {
		width: "100%",
		maxHeight: 120,
	},
	weatherText: {
		fontSize: 16,
		marginVertical: 2,
		textAlign: "center",
	},
	multiItem: {
		borderRadius: 8,
		padding: 5,
		marginHorizontal: 10,
		width: 120,
		alignItems: "center",
		borderWidth: 1,
		borderColor: '#ccc',
	},
	errorText: {
		color: '#ff6666',
		fontSize: 18,
		textAlign: 'center',
		padding: 20,
	},
});