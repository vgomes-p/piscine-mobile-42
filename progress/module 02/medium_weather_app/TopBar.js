import React, { useRef, useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CitiesSuggestionList } from './CitiesSuggestion';

export const TopBar = ({
	searchText,
	setSearchText,
	enterText,
	setEnterText,
	setIsSearchFocused,
	isSearchFocused,
	setIsGeolocationActive,
	triggerLocationRequest,
	onCitySelect,
	setErrorMessage
}) => {
	const textInputRef = useRef(null);
	const [suggestions, setSuggestions] = useState([]);

	useEffect(() => {
		const fetchSuggestions = async () => {
			if (enterText.trim().length < 2) {
				setSuggestions([]);
				setErrorMessage(null);
				return;
			}
			try {
				const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(enterText)}&count=5&language=en&format=json`;
				const response = await fetch(url);
				const data = await response.json();
				if (!data.results || data.results.length === 0) {
					setSuggestions([]);
					setErrorMessage("Error: Location not found.\nPlease enter a valid location.");
				} else {
					setSuggestions(data.results);
					setErrorMessage(null)
				}
			} catch (error) {
				console.error("Error on searching city:", error);
				setSuggestions([]);
				setErrorMessage("Connection error: Unable to search for cities.");
			}
		};
		fetchSuggestions();
	}, [enterText]);

	const handleClose = () => {
		setIsGeolocationActive(false);
		setSearchText('');
		setEnterText('');
		setSuggestions([]);
		setIsSearchFocused(false);
		setErrorMessage(null);
		textInputRef.current?.blur();
	};

	const handleSearchBarPress = () => {
		textInputRef.current?.focus();
		setIsSearchFocused(true);
	};

	const handleGeolocationPress = () => {
		setIsGeolocationActive(true);
		setIsSearchFocused(false);
		setSearchText('');
		setEnterText('');
		setSuggestions([]);
		setErrorMessage(null);
		triggerLocationRequest();
	};

	const handleSubmit = () => {
		if (suggestions.length > 0) {
			const firstSuggestion = suggestions[0];
			const cityString = `${firstSuggestion.name}, ${firstSuggestion.admin1}, ${firstSuggestion.country}`;
			setEnterText(cityString);
			setSearchText(enterText);
			setSuggestions([]);
			setIsGeolocationActive(false);
			setErrorMessage(null);
			if (onCitySelect) onCitySelect(firstSuggestion);
		} else if (enterText.trim().length > 0) {
			setErrorMessage("Error: Location not found.\nPlease enter a valid location.");
			setIsSearchFocused(false);
		}
	};

	const handleSuggestionPress = (item) => {
		const cityString = `${item.name}, ${item.admin1}, ${item.country}`;
		setEnterText(cityString);
		setSearchText(cityString);
		setSuggestions([]);
		setIsSearchFocused(false);
		setIsGeolocationActive(false);
		setErrorMessage(null);
		if (onCitySelect) onCitySelect(item);
	};

	const handleBlur = () => {
		setIsSearchFocused(false);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.topAppBar}>
				<TouchableOpacity style={styles.searchBar} onPress={handleSearchBarPress}>
					<View style={styles.sBarOrder}>
						<Icon name="search" size={15} color="#fff" />
						<TextInput
							ref={textInputRef}
							style={[{ padding: 0, margin: 0, marginLeft: 8 }, styles.searchInputText]}
							placeholder="Search"
							placeholderTextColor="#fff"
							value={enterText}
							onChangeText={setEnterText}
							onSubmitEditing={handleSubmit}
							onFocus={() => setIsSearchFocused(true)}
							onBlur={handleBlur}
							autoCorrect={false}
							keyboardType="default"
						/>
						{enterText.length > 0 && (
							<TouchableOpacity onPress={handleClose}>
								<Icon name="times" size={15} color="#fff" />
							</TouchableOpacity>
						)}
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress={handleGeolocationPress} style={styles.iconButton}>
					<Icon name="location-arrow" size={21} color="#fff" />
				</TouchableOpacity>
			</View>
			{isSearchFocused && suggestions.length > 0 && (
				<CitiesSuggestionList suggestions={suggestions} onSelect={handleSuggestionPress} />
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		backgroundColor: '#444',
	},
	topAppBar: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 40,
		height: 90,
		justifyContent: 'space-evenly',
	},
	searchBar: {
		height: 35,
		width: '80%',
		borderWidth: 1,
		borderRadius: 50,
		borderColor: '#fff',
		justifyContent: 'center',
	},
	sBarOrder: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10,
	},
	searchInputText: {
		flex: 1,
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold',
		marginLeft: 8,
	},
	iconButton: {
		padding: 5,
	},
});