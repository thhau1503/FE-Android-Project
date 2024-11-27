import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Button, Alert } from 'react-native';
import * as Location from 'expo-location';
import openMap from 'react-native-open-maps';

const MapScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null); // Lưu tọa độ hiện tại
  const destination = { latitude: 10.845258, longitude: 106.7945789 }; // Tọa độ đích

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Thông báo', 'Ứng dụng cần quyền truy cập vị trí để hiển thị.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const handleGetDirections = () => {
    if (currentLocation) {
      openMap({
        start: `${currentLocation.latitude},${currentLocation.longitude}`,
        end: `${destination.latitude},${destination.longitude}`,
        travelType: 'drive', // Lựa chọn: 'drive', 'walk', 'public_transport'
      });
    } else {
      Alert.alert('Thông báo', 'Không tìm thấy vị trí hiện tại của bạn.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: destination.latitude,
          longitude: destination.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* Marker mặc định */}
        <Marker
          coordinate={destination}
          title="Đích đến"
          description="Vị trí đích đến của bạn"
        />

        {/* Marker cho vị trí hiện tại */}
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Vị trí hiện tại"
            description="Bạn đang ở đây"
            pinColor="blue"
          />
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Chỉ đường" onPress={handleGetDirections} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '90%',
  },
  buttonContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
});

export default MapScreen;
