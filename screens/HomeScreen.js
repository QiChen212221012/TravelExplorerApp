import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Image, Modal, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { checkpoints } from '../checkpoints';
import { getDistanceFromLatLonInMeters } from '../utils/location';

export default function HomeScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [nearestPoint, setNearestPoint] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [checkedInPlaces, setCheckedInPlaces] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const imageMap = {
    'library.png': require('../assets/library.png'),
    'campus.png': require('../assets/campus.png'),
    'airport.png': require('../assets/airport.png'),
    'accommodation.png': require('../assets/accommodation.png'),
    'castle.png': require('../assets/castle.png'),
    'pablo.png': require('../assets/pablo.png'),
    'tower.png': require('../assets/tower.png'),
    'holmes.png': require('../assets/holmes.png'),
    'university.png': require('../assets/university.png'),
    // 添加你所有用到的图片名
  };
  
  const getImageSource = (filename) => {
    return imageMap[filename] || imageMap['library.png'];
  };  

  const loadData = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      const data = await AsyncStorage.getItem('checkin_records');
      if (data) {
        const records = JSON.parse(data);
        const places = records.map((r) => r.place);
        setCheckedInPlaces(places);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
        await loadData();
      })();
    }, [])
  );

  useEffect(() => {
    if (location) {
      const near = checkpoints.find((point) => {
        const distance = getDistanceFromLatLonInMeters(
          location.latitude,
          location.longitude,
          point.latitude,
          point.longitude
        );
        return distance < 50;
      });
      setNearestPoint(near || null);
    }
  }, [location, checkedInPlaces]);

  if (errorMsg) return <Text>{errorMsg}</Text>;
  if (!location) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      >
        {checkpoints.map((cp) => {
          const isCheckedIn = checkedInPlaces.includes(cp.name);
          return (
            <Marker
              key={cp.id}
              coordinate={{ latitude: cp.latitude, longitude: cp.longitude }}
              title={cp.name}
              pinColor={isCheckedIn ? 'gold' : 'red'}
              onPress={() => setSelectedPoint(cp)}
            />
          );
        })}
      </MapView>

      {selectedPoint && (
        <View style={styles.info}>
          <Text style={{ fontWeight: 'bold' }}>{selectedPoint.name}</Text>
          <Image
            source={getImageSource(selectedPoint.image)}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          {nearestPoint && nearestPoint.name === selectedPoint.name ? (
            <Button
              title="Go to Check-in Page"
              onPress={() => navigation.navigate('Check In')}
            />
          ) : (
            <Text style={{ color: '#666', marginTop: 5 }}>📍 Move closer to check in</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  info: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  thumbnail: {
    width: '90%',
    height: 180,
    borderRadius: 10,
    marginVertical: 8,
    resizeMode: 'cover',
  },
});
