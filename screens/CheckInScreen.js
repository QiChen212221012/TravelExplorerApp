// screens/CheckInScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkpoints } from '../checkpoints';

export default function CheckInScreen() {
  const [nearestCheckpoint, setNearestCheckpoint] = useState(null);
  const [loading, setLoading] = useState(true);

  const getImage = (imageName) => {
    switch (imageName) {
      case 'library.png':
        return require('../assets/library.png');
      case 'campus.png':
        return require('../assets/campus.png');
    case 'university.png':
        return require('../assets/university.png');
      case 'airport.png':
        return require('../assets/airport.png');
    case 'accommodation.png':
        return require('../assets/accommodation.png');
    case 'castle.png':
        return require('../assets/castle.png');
      default:
        return require('../assets/library.png');
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const closest = findNearestCheckpoint(latitude, longitude);
      if (closest && closest.distance <= 50) {
        setNearestCheckpoint(closest);
      } else {
        setNearestCheckpoint(null);
      }
      setLoading(false);
    })();
  }, []);

  const findNearestCheckpoint = (lat, lon) => {
    let nearest = null;
    let minDistance = Infinity;

    for (const point of checkpoints) {
      const distance = getDistanceFromLatLonInM(lat, lon, point.latitude, point.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = point;
      }
    }

    return nearest ? { ...nearest, distance: Math.round(minDistance) } : null;
  };

  const getDistanceFromLatLonInM = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleCheckIn = async () => {
    try {
      const record = {
        place: nearestCheckpoint.name,
        time: new Date().toLocaleString(), // ✅ 关键点，确保不是 undefined
        coords: {
          latitude: nearestCheckpoint.latitude,
          longitude: nearestCheckpoint.longitude,
        },
      };
  
      const existing = await AsyncStorage.getItem('checkin_records');
      const records = existing ? JSON.parse(existing) : [];
  
      const alreadyCheckedIn = records.some(
        (r) => r.place === record.place
      );
  
      if (alreadyCheckedIn) {
        Alert.alert('⚠️ You have already checked in here.');
        return;
      }
  
      records.push(record);
      await AsyncStorage.setItem('checkin_records', JSON.stringify(records));
  
      Alert.alert('✅ Check-in successful!');
    } catch (error) {
      console.error(error);
      Alert.alert('❌ Check-in failed');
    }
  };  

  return (
    <LinearGradient
      colors={['#e0f7f4', '#c8f1fc']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#00695c" />
        ) : nearestCheckpoint ? (
          <View style={styles.card}>
            <Image source={getImage(nearestCheckpoint.image)} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.title}>{nearestCheckpoint.name}</Text>
              <Text style={styles.description}>
                This checkpoint allows you to mark attendance nearby.
              </Text>
              <View style={styles.metaInfo}>
                <Ionicons name="location" size={16} color="#f44336" />
                <Text style={styles.metaText}>Distance: {nearestCheckpoint.distance}m</Text>
              </View>
              <TouchableOpacity onPress={handleCheckIn}>
                <Text style={styles.checkInButton}>Start Check In</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={{ color: '#444', fontSize: 16 }}>📍 You are not near any checkpoint</Text>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, alignItems: 'center' },
  card: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  image: { width: '100%', height: 180 },
  cardContent: { padding: 16 },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaText: {
    fontSize: 13,
    color: '#444',
    marginLeft: 4,
  },
  checkInButton: {
    fontSize: 16,
    color: '#00695c',
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 8,
  },
});
