import { React, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export const TopBar = ({
		searchText,
		setSearchText,
		enterText,
		setEnterText,
		setIsSearchFocused,
		isSearchFocused,
		setIsGeolocationActive,
	}) => {

	const textInputRef = useRef(null);
	
	// const handleClose = () => {
	// 	setIsGeolocationActive(false);
	// 	setSearchText('');
	// 	setEnterText('');
	// };

	const handleSearchBarPress = () => {
		textInputRef.current?.focus();
		setIsSearchFocused(true);
	};

	const handleGeolocationPress = () => {
		setIsGeolocationActive(true);
		setIsSearchFocused(false);
		setSearchText('');
		setEnterText('');
	};
	const handleSubmit = () => {
		setSearchText(enterText);
		setIsGeolocationActive(false);
		textInputRef.current?.blur();
		setIsSearchFocused(false);
	};


	useEffect(() => {
		const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
			textInputRef.current?.blur();
			setIsSearchFocused(false);
		});

		return () => {
			keyboardDidHideListener.remove();
		};
	}, [setIsSearchFocused]);

	return (
	<SafeAreaView>
		<View style={styles.topAppBar}>
			<TouchableOpacity
				style={styles.searchBar}
				onPress={handleSearchBarPress}
				activeOpacity={1}
			>
				<View style={styles.sBarOrder}>
					<Icon name="search" size={10} color="#fff" />
					<TextInput
						ref={textInputRef}
						style={[{padding: 0, margin: 0, marginLeft: 8}, styles.searchInputText]}
						placeholder='search'
						placeholderTextColor='#fff'
						value={enterText}
						onChangeText={setEnterText}
						onSubmitEditing={handleSubmit}
					/>
					{/*{isSearchFocused && (<Icon name="times" size={15} color="#fff" onClick={handleClose}/>)}*/}
				</View>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={handleGeolocationPress}
				style={styles.iconButton}
			>
				<Icon name='paper-plane' size={21} color="#fff" />
			</TouchableOpacity>
		</View>
	</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	sBarOrder: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		paddingLeft: 10,
		paddingRight: 10,
	},
	iconButton: {
		padding: 0,
	},
	topAppBar: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 40,
		width: '100%',
		height: 90,
		backgroundColor: '#444',
		justifyContent: 'space-evenly',
	},
	searchInputText: {
		flex: 1,
		color: '#ffffff',
		fontSize: 15,
		fontWeight: 'bold',
	},
	searchBar: {
		height: 30,
		width: '80%',
		borderWidth: 1,
		borderRadius: 50,
		borderColor: '#fff',
		justifyContent: 'center',
		alignItems: 'flex-start',
	},
});