// screens/BadgesScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function BadgesScreen() {
  const [badges, setBadges] = useState([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const earnedBadges = [];

        const firstBadge = await AsyncStorage.getItem('badge_first_checkin');
        if (firstBadge === 'true') {
          earnedBadges.push({
            id: 'first',
            name: 'First Check-in',
            image: require('../assets/first_badge.png'),
            description: 'Awarded for your very first check-in! 🎉',
          });
        }

        const explorerBadge = await AsyncStorage.getItem('badge_four_places'); // ✅ 当前是 4 个地点
        if (explorerBadge === 'true') {
          earnedBadges.push({
            id: 'explorer',
            name: 'Explorer',
            image: require('../assets/four_badge.png'),
            description: 'Unlocked after checking in at 4 different places! 🗺️',
          });
        }

        setBadges(earnedBadges);
      })();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🏅 My Badges</Text>
      {badges.length === 0 ? (
        <Text style={styles.empty}>No badges earned yet.</Text>
      ) : (
        badges.map((badge) => (
          <View key={badge.id} style={styles.card}>
            <Image source={badge.image} style={styles.image} />
            <Text style={styles.name}>{badge.name}</Text>
            <Text style={styles.description}>{badge.description}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f3fdf6',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  empty: {
    color: '#888',
    fontStyle: 'italic',
    marginTop: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 4,
  },
});
