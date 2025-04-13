import React, { useMemo } from "react";
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LineChart } from "react-native-chart-kit";

export const TabContent = ({ selectedTab, weatherData, lastSearch, errorMessage }) => {
	const { width, height } = useWindowDimensions();
	const isPortrait = height >= width;
	const screenWidth = width;

	const weatherCodeToDescription = (code) => {
		const codes = {
			0: { description: "Clear Sky", icon: "weather-sunny" },
			1: { description: "Mainly Clear", icon: "weather-sunny" },
			2: { description: "Partly Cloudy", icon: "weather-partly-cloudy" },
			3: { description: "Overcast", icon: "weather-cloudy" },
			45: { description: "Fog", icon: "weather-fog" },
			51: { description: "Light Drizzle", icon: "weather-rainy" },
			61: { description: "Light Rain", icon: "weather-rainy" },
			63: { description: "Moderate Rain", icon: "weather-pouring" },
			65: { description: "Heavy Rain", icon: "weather-pouring" },
			71: { description: "Light Snow", icon: "weather-snowy" },
			73: { description: "Moderate Snow", icon: "weather-snowy" },
			75: { description: "Heavy Snow", icon: "weather-snowy-heavy" },
		};
		return codes[code] || { description: "Unknown", icon: "help-circle" };
	};

	const chartConfig = {
		backgroundGradientFrom: "#000000",
		backgroundGradientTo: "#000000",
		backgroundGradientFromOpacity: 0.4,
		backgroundGradientToOpacity: 0.4,
		decimalPlaces: 1,
		color: (opacity = 1) => "#fff2e3",
		labelColor: (opacity = 1) => "#fff2e3",
		style: {
			borderRadius: 16,
		},
		propForDots: {
			r: "0",
			strokeWidth: "0",
		},
		useShadowColorFromDataset: false,
	};

	const todayComputed = useMemo(() => {
		if (!weatherData || !lastSearch || !weatherData.hourly) {
			return { todayData: [], chartData: { labels: [], datasets: [] } };
		}

		const { hourly } = weatherData;

		const now = new Date();
		const currentTimestamp = now.getTime();
		const oneHourInMs = 60 * 60 * 1000;
		const next24HoursTimestamp = currentTimestamp + 24 * oneHourInMs;

		const todayData = hourly.time
			.map((time, index) => {
				const timestamp = new Date(time).getTime();
				return {
					time: time.slice(11, 16),
					fullTime: time,
					temp: hourly.temperature_2m[index],
					weather: weatherCodeToDescription(hourly.weathercode[index]),
					wind: hourly.windspeed_10m[index],
					timestamp: timestamp,
				};
			})
			.filter(
				(item) =>
					item.timestamp >= currentTimestamp &&
					item.timestamp <= next24HoursTimestamp
			)
			.slice(0, 24);

		const chartTodayData = todayData.filter((_, index) => index % 3 === 0);
		const chartData = {
			labels: chartTodayData.map((item) => item.time),
			datasets: [
				{
					data: chartTodayData.map((item) => item.temp),
					color: (opacity = 1) => "#FF8438",
					strokeWidth: 2,
					withDots: false,
				},
			],
		};

		return { todayData, chartData };
	}, [weatherData, lastSearch]);

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
		if (errorMessage)
			return <Text style={styles.errorText}>{errorMessage}</Text>;
		if (!weatherData || !lastSearch || !weatherData.current)
			return <Text style={styles.noDataText}>No data available</Text>;
		const { current } = weatherData;
		const weatherInfo = weatherCodeToDescription(current.weathercode);
		return (
			<View style={styles.tabContent}>
				{renderCityHeader()}
				<View style={styles.weatherContainer}>
					<Text style={styles.currentWeatherText}>
						Temperature: {current.temperature_2m}°C
					</Text>
					<View style={styles.currentWeatherRow}>
						<Icon name={weatherInfo.icon} size={24} color="#fff2e3" />
						<Text style={styles.currentWeatherText}> {weatherInfo.description}</Text>
					</View>
					<View style={styles.currentWeatherRow}>
						<Icon name="weather-windy" size={24} color="#fff2e3" />
						<Text style={styles.currentWeatherText}> {current.windspeed_10m} km/h</Text>
					</View>
				</View>
			</View>
		);
	};

	const renderToday = () => {
		if (errorMessage)
			return <Text style={styles.errorText}>{errorMessage}</Text>;
		if (!weatherData || !lastSearch || !weatherData.hourly)
			return <Text style={styles.noDataText}>No data available</Text>;

		const { todayData, chartData } = todayComputed;
		if (isPortrait) {
			const labelWidth = 45;
			const totalWidth = chartData.labels.length * labelWidth;
			return (
				<View style={styles.tabContent}>
					{renderCityHeader()}
					<LineChart
						data={chartData}
						width={totalWidth}
						height={220}
						chartConfig={{
							...chartConfig,
							scrollable: true,
							fromZero: true,
							propsForLabels: {
								fontSize: 12,
							},
						}}
						horizontalLabelRotation={0}
						segments={5}
						style={styles.chart}
						withVerticalLines={true}
						xLabelsOffset={-5}
					/>
					<ScrollView
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						style={styles.weatherContainer}
					>
						{todayData.map((item, index) => (
							<View key={index} style={styles.multiItem}>
								<Text style={styles.weatherText}>{item.time}</Text>
								<Text style={styles.weatherText}>
									Temp: {item.temp}°C
								</Text>
								<View style={styles.weatherRow}>
									<Icon
										name={item.weather.icon}
										size={20}
										color="#FFF2E3"
									/>
									<Text style={styles.weatherText}>
										{" "}
										{item.weather.description}
									</Text>
								</View>
								<View style={styles.weatherRow}>
									<Icon
										name="weather-windy"
										size={24}
										color="#FFF2E3"
									/>
									<Text style={styles.weatherText}>
										{" "}
										{item.wind} km/h
									</Text>
								</View>
							</View>
						))}
					</ScrollView>
				</View>
			);
		}
		return (
			<View style={styles.tabContent}>
				{renderCityHeader()}
				<View style={styles.landscapeContainer}>
					<View style={styles.temperatureColumn}>
						<ScrollView showsVerticalScrollIndicator={false} style={[{marginBottom: 20, marginTop: 5}]}>
							{todayData.map((item, index) => (
								<View key={index} style={styles.multiItemLandscape}>
									<Text style={styles.weatherText}>{item.time}</Text>
									<Text style={styles.weatherText}>
										Temp: {item.temp}°C
									</Text>
									<View style={styles.weatherRow}>
										<Icon
											name={item.weather.icon}
											size={18}
											color="#FFF2E3"
										/>
										<Text style={styles.weatherText}>
											{" "}
											{item.weather.description}
										</Text>
									</View>
									<View style={styles.weatherRow}>
										<Icon
											name="weather-windy"
											size={20}
											color="#FFF2E3"
										/>
										<Text style={styles.weatherText}>
											{" "}
											{item.wind} km/h
										</Text>
									</View>
								</View>
							))}
						</ScrollView>
					</View>
					<View style={styles.chartContainerLandscape}>
						<LineChart
							data={chartData}
							width={screenWidth * 0.50}
							height={180}
							chartConfig={{
								...chartConfig,
								fromZero: true,
								propsForLabels: {
									fontSize: 10,
								},
							}}
							horizontalLabelRotation={0}
							segments={5}
							style={styles.chart}
							withVerticalLines={true}
							xLabelsOffset={-5}
						/>
					</View>
				</View>
			</View>
		);
	};

	const renderWeekly = () => {
		if (errorMessage)
			return <Text style={styles.errorText}>{errorMessage}</Text>;
		if (!weatherData || !lastSearch || !weatherData.daily)
			return <Text style={styles.noDataText}>No data available</Text>;
		const { daily } = weatherData;

		const chartData = {
			labels: daily.time.map((date) => date.slice(5)),
			datasets: [
				{
					data: daily.temperature_2m_max,
					color: (opacity = 1) => "#ff6464",
					strokeWidth: 2,
					withDots: false,
				},
				{
					data: daily.temperature_2m_min,
					color: (opacity = 1) => "#6464ff",
					strokeWidth: 2,
					withDots: false,
				},
			],
			legend: ["Max Temp (°C)", "Min Temp (°C)"],
		};

		if (isPortrait) {
			return (
				<View style={styles.tabContent}>
					{renderCityHeader()}
					<LineChart
						data={chartData}
						width={screenWidth - 40}
						height={220}
						chartConfig={chartConfig}
						bezier
						style={styles.chart}
					/>
					<ScrollView
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						style={styles.weatherContainer}
					>
						{daily.time.map((date, index) => {
							const weatherInfo = weatherCodeToDescription(
								daily.weathercode[index]
							);
							return (
								<View key={index} style={styles.multiItem}>
									<Text style={styles.weatherText}>{date}</Text>
									<Text style={styles.weatherText}>
										Max: {daily.temperature_2m_max[index]}°C
									</Text>
									<Text style={styles.weatherText}>
										Min: {daily.temperature_2m_min[index]}°C
									</Text>
									<View style={styles.weatherRow}>
										<Icon
											name={weatherInfo.icon}
											size={20}
											color="#fff2e3"
										/>
										<Text style={styles.weatherText}>
											{" "}
											{weatherInfo.description}
										</Text>
									</View>
								</View>
							);
						})}
					</ScrollView>
				</View>
			);
		}
		return (
			<View style={styles.tabContent}>
				{renderCityHeader()}
				<View style={styles.landscapeContainer}>
					<View style={styles.temperatureColumn}>
						<ScrollView showsVerticalScrollIndicator={false} style={[{marginBottom: 15}]}>
							{daily.time.map((date, index) => {
								const weatherInfo = weatherCodeToDescription(
									daily.weathercode[index]
								);
								return (
									<View key={index} style={styles.multiItemLandscape}>
										<Text style={styles.weatherText}>{date}</Text>
										<Text style={styles.weatherText}>
											Max: {daily.temperature_2m_max[index]}°C
										</Text>
										<Text style={styles.weatherText}>
											Min: {daily.temperature_2m_min[index]}°C
										</Text>
										<View style={styles.weatherRow}>
											<Icon
												name={weatherInfo.icon}
												size={18}
												color="#fff2e3"
											/>
											<Text style={styles.weatherText}>
												{" "}
												{weatherInfo.description}
											</Text>
										</View>
									</View>
								);
							})}
						</ScrollView>
					</View>
					<View style={styles.chartContainerLandscape}>
						<LineChart
							data={chartData}
							width={screenWidth * 0.50}
							height={165}
							chartConfig={chartConfig}
							bezier
							style={styles.chart}
						/>
					</View>
				</View>
			</View>
		);
	};

	switch (selectedTab) {
		case "Currently":
			return renderCurrently();
		case "Today":
			return renderToday();
		case "Weekly":
			return renderWeekly();
		default:
			return <Text style={styles.errorText}>Tab not found</Text>;
	}
};

const styles = StyleSheet.create({
	noDataText: {
		color: "#fff2e3",
	},
	tabContent: {
		width: "100%",
		padding: 20,
		alignItems: "center",
	},
	locationText: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 2,
		textAlign: "center",
		color: "#fff2e3",
	},
	weatherContainer: {
		width: "100%",
		maxHeight: 120,
	},
	weatherText: {
		fontSize: 16,
		marginVertical: 2,
		textAlign: "center",
		color: "#fff2e3",
	},
	weatherRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 2,
	},
	currentWeatherText: {
		fontSize: 20,
		marginVertical: 2,
		textAlign: "center",
		color: "#fff2e3",
	},
	currentWeatherRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 2,
	},
	multiItem: {
		borderRadius: 8,
		padding: 5,
		marginHorizontal: 10,
		width: 120,
		alignItems: "center",
		borderWidth: 2,
		borderColor: "#fff2e3",
	},
	multiItemLandscape: {
		borderRadius: 8,
		padding: 5,
		marginVertical: 10,
		marginHorizontal: 5,
		width: 120,
		alignItems: "center",
		borderWidth: 2,
		borderColor: "#fff2e3",
	},
	errorText: {
		color: "#ff6666",
		fontSize: 18,
		textAlign: "center",
		padding: 20,
	},
	chart: {
		marginVertical: 8,
		borderRadius: 8,
		marginBottom: 25
	},
	landscapeContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
	},
	temperatureColumn: {
		marginRight: 10,
		maxHeight: 200,
	},
	chartContainerLandscape: {
		alignItems: "center",
		justifyContent: "center",
	},
});
