import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [userToken, setUserToken] = useState(null);
	const [userInfo, setUserInfo] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const login = async (email, password) => {
		setIsLoading(true);
		try {
			const response = await client.post('/auth/login', { email, password });
			const { token, ...user } = response.data;

			setUserToken(token);
			setUserInfo(user);

			await AsyncStorage.setItem('token', token);
			await AsyncStorage.setItem('userInfo', JSON.stringify(user));
		} catch (error) {
			console.log('Login error', error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (name, email, password, phone, user_type) => {
		setIsLoading(true);
		try {
			const response = await client.post('/auth/register', {
				name, email, password, phone, user_type
			});

			// Auto-login after register
			const { token, ...user } = response.data;

			setUserToken(token);
			setUserInfo(user);

			await AsyncStorage.setItem('token', token);
			await AsyncStorage.setItem('userInfo', JSON.stringify(user));
		} catch (error) {
			console.log('Register error', error);
			throw error; // Rethrow to let the component handle UI feedback
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		setIsLoading(true);
		setUserToken(null);
		setUserInfo(null);
		await AsyncStorage.removeItem('token');
		await AsyncStorage.removeItem('userInfo');
		setIsLoading(false);
	};

	const isLoggedIn = async () => {
		try {
			setIsLoading(true);
			let token = await AsyncStorage.getItem('token');
			let user = await AsyncStorage.getItem('userInfo');

			if (token) {
				setUserToken(token);
				setUserInfo(JSON.parse(user));
			}
		} catch (error) {
			console.log('IsLoggedIn error', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		isLoggedIn();
	}, []);

	return (
		<AuthContext.Provider value={{ login, register, logout, isLoading, userToken, userInfo, setUserInfo }}>
			{children}
		</AuthContext.Provider>
	);
};
