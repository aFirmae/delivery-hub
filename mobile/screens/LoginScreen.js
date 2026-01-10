import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
	const { login, isLoading } = useContext(AuthContext);

	const handleLogin = async () => {
        setErrorMessage('');
		if (!email || !password) {
            setErrorMessage('Please fill in all fields');
			return;
		}
        try {
		    await login(email, password);
        } catch (error) {
            if (error.response?.status === 401) {
                setErrorMessage('Incorrect email or password');
            } else if (error.response?.status === 404) {
                 setErrorMessage('Email not registered');
            } else {
                setErrorMessage('Login failed. Please try again.');
            }
        }
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={{ flex: 1 }}
			>
				<ScrollView contentContainerStyle={styles.scroll}>
					<View style={styles.logoContainer}>
						<View style={styles.logoCircle}>
							<Feather name="box" size={40} color="white" />
						</View>
						<Text style={styles.appName}>Delivery Hub</Text>
						<Text style={styles.tagline}>Fast. Reliable. Secure.</Text>
					</View>

					<View style={styles.formContainer}>
						<Text style={styles.welcomeText}>Welcome Back!</Text>

						<View style={styles.inputContainer}>
							<Feather name="mail" size={20} color="#666" style={styles.icon} />
							<TextInput
								style={styles.input}
								placeholder="Email"
								value={email}
								onChangeText={setEmail}
								autoCapitalize="none"
								keyboardType="email-address"
							/>
						</View>

						<View style={styles.inputContainer}>
							<Feather name="lock" size={20} color="#666" style={styles.icon} />
							<TextInput
								style={styles.input}
								placeholder="Password"
								value={password}
								onChangeText={setPassword}
								secureTextEntry={!passwordVisible}
							/>
                            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                                <Feather name={passwordVisible ? "eye" : "eye-off"} size={20} color="#666" />
                            </TouchableOpacity>
						</View>

                        {errorMessage ? (
                            <View style={styles.errorContainer}>
                                <Feather name="alert-circle" size={18} color="#D32F2F" />
                                <Text style={styles.errorText}>{errorMessage}</Text>
                            </View>
                        ) : null}

						<TouchableOpacity
							style={styles.button}
							onPress={handleLogin}
							disabled={isLoading}
						>
							{isLoading ? (
								<ActivityIndicator color="white" />
							) : (
								<Text style={styles.buttonText}>Login</Text>
							)}
						</TouchableOpacity>

						<View style={styles.footer}>
							<Text style={styles.footerText}>Don't have an account? </Text>
							<TouchableOpacity onPress={() => navigation.navigate('Register')}>
								<Text style={styles.link}>Sign Up</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	scroll: {
		flexGrow: 1,
		justifyContent: 'center',
		padding: 20
	},
	logoContainer: {
		alignItems: 'center',
		marginBottom: 40
	},
	logoCircle: {
		width: 80,
		height: 80,
		backgroundColor: '#007AFF',
		borderRadius: 40,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 15,
		elevation: 10,
		shadowColor: '#007AFF',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.4,
		shadowRadius: 10
	},
	appName: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#1a1a1a',
		marginBottom: 5
	},
	tagline: {
		fontSize: 16,
		color: '#666'
	},
	formContainer: {
		width: '100%'
	},
	welcomeText: {
		fontSize: 22,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 20
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f8f9fa',
		borderWidth: 1,
		borderColor: '#e9ecef',
		borderRadius: 12,
		marginBottom: 15,
		paddingHorizontal: 15
	},
	icon: {
		marginRight: 10
	},
	input: {
		flex: 1,
		paddingVertical: 15,
		fontSize: 16,
		color: '#1a1a1a'
	},
	button: {
		backgroundColor: '#007AFF',
		padding: 18,
		borderRadius: 12,
		alignItems: 'center',
		marginTop: 10,
		elevation: 5,
		shadowColor: '#007AFF',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8
	},
	buttonText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 18
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 20
	},
	footerText: {
		color: '#666',
		fontSize: 15
	},
	link: {
		color: '#007AFF',
		fontWeight: 'bold',
		fontSize: 15
	},
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        padding: 10,
        backgroundColor: '#FFEBEE',
        borderRadius: 8
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8
    }
});

export default LoginScreen;
