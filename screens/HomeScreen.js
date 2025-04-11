import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Image } from 'react-native';
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

  const getImageSource = (filename) => {
    switch (filename) {
      case 'library.png': return require('../assets/library.png');
      case 'campus.png': return require('../assets/campus.png');
      case 'airport.png': return require('../assets/airport.png');
      case 'accommodation.png': return require('../assets/accommodation.png');
      case 'castle.png': return require('../assets/castle.png');
      default: return require('../assets/library.png');
    }
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

  // ✅ 每次页面重新聚焦时刷新
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
            />
          );
        })}
      </MapView>

      <View style={styles.info}>
        {nearestPoint ? (
          <>
            <Text>✅ Checkpoint reached: {nearestPoint.name}</Text>
            <Image
              source={getImageSource(nearestPoint.image)}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <Button
              title="Go to Check-in Page"
              onPress={() => navigation.navigate('Check In')}
            />
          </>
        ) : (
          <Text>📍 You are not near any checkpoint</Text>
        )}
      </View>
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
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginVertical: 8,
  },
});
