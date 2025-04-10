import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { checkpoints } from '../checkpoints';
import styles from '../styles/CheckInStyles';

// ✅ 替代 uuid 的唯一 ID 生成器
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

export default function CheckInScreen() {
  const [nearestCheckpoint, setNearestCheckpoint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const getImage = (imageName) => {
    switch (imageName) {
      case 'library.png': return require('../assets/library.png');
      case 'campus.png': return require('../assets/campus.png');
      case 'university.png': return require('../assets/university.png');
      case 'airport.png': return require('../assets/airport.png');
      case 'accommodation.png': return require('../assets/accommodation.png');
      case 'castle.png': return require('../assets/castle.png');
      case 'pablo.png': return require('../assets/pablo.png');
      default: return require('../assets/library.png');
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
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    } else {
      const cameraResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!cameraResult.canceled) {
        setImageUri(cameraResult.assets[0].uri);
      }
    }
  };

  const handleCheckIn = async () => {
    try {
      const record = {
        place: nearestCheckpoint.name,
        time: new Date().toISOString(),
        coords: {
          latitude: nearestCheckpoint.latitude,
          longitude: nearestCheckpoint.longitude,
        },
        notes: [
          {
            id: generateId(),
            text: note,
            image: imageUri,
            time: new Date().toISOString(),
          },
        ],
      };

      const existing = await AsyncStorage.getItem('checkin_records');
      const records = existing ? JSON.parse(existing) : [];
      const alreadyCheckedIn = records.some((r) => r.place === record.place);
      if (alreadyCheckedIn) {
        Alert.alert('⚠️ You have already checked in here.');
        return;
      }

      records.push(record);
      await AsyncStorage.setItem('checkin_records', JSON.stringify(records));
      Alert.alert('✅ Check-in successful!');
      setNote('');
      setImageUri(null);
    } catch (error) {
      console.error(error);
      Alert.alert('❌ Check-in failed');
    }
  };

  return (
    <LinearGradient colors={['#e0f7f4', '#c8f1fc']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#00695c" />
        ) : nearestCheckpoint ? (
          <View style={styles.card}>
            <Image source={getImage(nearestCheckpoint.image)} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.title}>{nearestCheckpoint.name}</Text>
              <Text style={styles.description}>This checkpoint allows you to mark attendance nearby.</Text>
              <View style={styles.metaInfo}>
                <Ionicons name="location" size={16} color="#f44336" />
                <Text style={styles.metaText}>Distance: {nearestCheckpoint.distance}m</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="✍️ Add notes or description..."
                value={note}
                onChangeText={setNote}
              />
              <TouchableOpacity onPress={pickImage} style={styles.pickButton}>
                <Text style={{ color: '#00695c' }}>🖼️ Choose Photo</Text>
              </TouchableOpacity>
              {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
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
