import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Usa la IP correcta según tu entorno
const API_BASE_URL = 'http://10.0.2.2:3000/api'; // Android emulador (Genymotion o AVD)
// const API_BASE_URL = 'http://localhost:3000/api'; // iOS simulador (solo funciona en iOS)
// const API_BASE_URL = 'http://192.168.x.x:3000/api'; // Dispositivo físico (usa tu IP local)

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor asíncrono para agregar el token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Error al obtener el token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;