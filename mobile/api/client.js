import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// UPDATE THIS IP ADDRESS TO YOUR MACHINE'S LOCAL IP IF RUNNING ON PHYSICAL DEVICE
// For Android Emulator use 10.0.2.2
// For iOS Simulator use localhost
const DEV_BACKEND_URL = Platform.OS === 'android' ? 'http://192.168.0.7:5000' : 'http://localhost:5000';

const client = axios.create({
  baseURL: DEV_BACKEND_URL,
});

client.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;
