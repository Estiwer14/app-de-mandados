import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { phone });
      const { user, token } = response.data;
      login(user, token);
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Login</Text>
      <TextInput
        placeholder="Número de teléfono"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <Button title="Iniciar Sesión" onPress={handleLogin} />
      <Button title="Registrarse" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

export default LoginScreen;