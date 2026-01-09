import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Picker } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const RegisterScreen = ({ navigation }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const [userType, setUserType] = useState('sender'); // sender or delivery_partner

	const { register, isLoading } = useContext(AuthContext);

	const handleRegister = async () => {
		if (!name || !email || !password) {
			Alert.alert("Error", "Please fill in all fields");
			return;
		}
		try {
			await register(name, email, password, phone, userType);
			Alert.alert("Success", "Account created! Please login.");
			navigation.navigate('Login');
		} catch (e) {
			Alert.alert("Registration Failed", "Something went wrong.");
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.wrapper}>
				<Text style={styles.title}>Create Account</Text>

				<TextInput
					style={styles.input}
					value={name}
					placeholder="Full Name"
					onChangeText={setName}
				/>

				<TextInput
					style={styles.input}
					value={email}
					placeholder="Email"
					onChangeText={setEmail}
					autoCapitalize="none"
				/>

				<TextInput
					style={styles.input}
					value={phone}
					placeholder="Phone (Optional)"
					onChangeText={setPhone}
					keyboardType="phone-pad"
				/>

				<TextInput
					style={styles.input}
					value={password}
					placeholder="Password"
					onChangeText={setPassword}
					secureTextEntry
				/>

				<Text style={styles.label}>I am a:</Text>
				<View style={styles.typeContainer}>
					<TouchableOpacity
						style={[styles.typeButton, userType === 'sender' && styles.selectedType]}
						onPress={() => setUserType('sender')}
					>
						<Text style={userType === 'sender' ? styles.selectedText : styles.text}>Sender</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.typeButton, userType === 'delivery_partner' && styles.selectedType]}
						onPress={() => setUserType('delivery_partner')}
					>
						<Text style={userType === 'delivery_partner' ? styles.selectedText : styles.text}>Delivery Partner</Text>
					</TouchableOpacity>
				</View>

				{isLoading ? (
					<ActivityIndicator size="large" color="#0000ff" />
				) : (
					<Button title="Register" onPress={handleRegister} />
				)}

				<View style={{ flexDirection: 'row', marginTop: 20 }}>
					<Text>Already have an account? </Text>
					<TouchableOpacity onPress={() => navigation.navigate('Login')}>
						<Text style={styles.link}>Login</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	wrapper: {
		width: '80%',
		alignItems: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 30,
	},
	input: {
		marginBottom: 12,
		borderWidth: 1,
		borderColor: '#bbb',
		borderRadius: 5,
		paddingHorizontal: 14,
		width: '100%',
		height: 45,
		backgroundColor: 'white'
	},
	link: {
		color: 'blue',
	},
	label: {
		alignSelf: 'flex-start',
		marginBottom: 5,
		fontWeight: 'bold'
	},
	typeContainer: {
		flexDirection: 'row',
		marginBottom: 20,
		width: '100%',
		justifyContent: 'space-between'
	},
	typeButton: {
		flex: 0.48,
		padding: 10,
		borderWidth: 1,
		borderColor: '#ddd',
		alignItems: 'center',
		borderRadius: 5
	},
	selectedType: {
		backgroundColor: '#007AFF',
		borderColor: '#007AFF'
	},
	text: {
		color: 'black'
	},
	selectedText: {
		color: 'white'
	}
});

export default RegisterScreen;
