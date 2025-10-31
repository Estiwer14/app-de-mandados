import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert } from 'react-native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user.role === 'mandadero') {
      fetchPendingOrders();
    }
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const response = await api.get('/orders/pending');
      setOrders(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los pedidos');
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      const response = await api.put(`/orders/${orderId}/accept`);
      Alert.alert('Éxito', 'Pedido aceptado');
      fetchPendingOrders(); // Refrescar lista
    } catch (error) {
      Alert.alert('Error', 'No se pudo aceptar el pedido');
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={{ padding: 10, borderBottomWidth: 1 }}>
      <Text>{item.pickup_address} → {item.delivery_address}</Text>
      <Text>Precio: ${item.price}</Text>
      {user.role === 'mandadero' && (
        <Button title="Aceptar Pedido" onPress={() => handleAcceptOrder(item.id)} />
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Bienvenido, {user.name}</Text>
      <Button title="Crear Pedido" onPress={() => navigation.navigate('OrderDetail')} />
      <Button title="Ver Mapa" onPress={() => navigation.navigate('Map')} />
      <Button title="Perfil" onPress={() => navigation.navigate('Profile')} />

      {user.role === 'mandadero' && (
        <>
          <Text style={{ marginTop: 20 }}>Pedidos Pendientes:</Text>
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
          />
        </>
      )}
    </View>
  );
};

export default HomeScreen;