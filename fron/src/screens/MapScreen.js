import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const MapScreen = () => {
  const [region, setRegion] = useState({
    latitude: 6.2518, // Ejemplo: Medellín
    longitude: -75.5684,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [markers, setMarkers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    getCurrentLocation();
    loadNearbyMandaderos();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setRegion({
          ...region,
          latitude,
          longitude,
        });
        updateLocation(latitude, longitude);
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const updateLocation = async (lat, lng) => {
    try {
      await api.put('/users/location', { lat, lng });
    } catch (error) {
      console.error('Error actualizando ubicación:', error);
    }
  };

  const loadNearbyMandaderos = async () => {
    try {
      // Simulación: en producción, tendrías un endpoint que devuelve mandaderos cercanos
      const mockMandaderos = [
        { id: '1', name: 'Juan', lat: 6.252, lng: -75.568 },
        { id: '2', name: 'María', lat: 6.251, lng: -75.569 },
      ];
      setMarkers(mockMandaderos);
    } catch (error) {
      console.error('Error cargando mandaderos:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.lat, longitude: marker.lng }}
            title={marker.name}
          />
        ))}
      </MapView>
      <Button title="Actualizar Ubicación" onPress={getCurrentLocation} />
    </View>
  );
};

export default MapScreen;