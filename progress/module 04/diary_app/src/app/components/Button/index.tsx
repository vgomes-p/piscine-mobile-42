import { TouchableOpacity, TouchableOpacityProps, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons"
import { styles } from "./style";

interface ButtonProps extends TouchableOpacityProps {
	title: string
	txcolor: string
	icolor: string
	bgcolor: string
	isLoading?: boolean
	loadcolor: string
	icon: keyof typeof Ionicons.glyphMap
}

export function Button({ title, txcolor, isLoading = false, icon, icolor, bgcolor, loadcolor, ...rest }: ButtonProps) {
	return (
		<TouchableOpacity style={[styles.container, { backgroundColor: bgcolor }]} disabled={isLoading} activeOpacity={0.8} {...rest}>
			{isLoading ? (
				<ActivityIndicator color={loadcolor}/>
			) : (
				<>
					<Ionicons name={icon} style={[{ color: icolor }, styles.icon]} />
					<Text style={[{ color: txcolor }, styles.text]}>{title}</Text>
				</>
			)}
		</TouchableOpacity>
	)
}