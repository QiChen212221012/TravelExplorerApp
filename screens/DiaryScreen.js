import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DiaryScreen() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await AsyncStorage.getItem('checkin_records');
      if (data) {
        setRecords(JSON.parse(data).reverse()); // 最新记录在前
      }
    };
    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📖 My Check-in Diary</Text>
      {records.length === 0 ? (
        <Text style={styles.empty}>No check-in records yet.</Text>
      ) : (
        records.map((record, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.place}>{record.place}</Text>
            <Text style={styles.time}>🕒 {record.time ? record.time : 'Unknown time'}</Text>
            <Text style={styles.location}>
              📍 {record.coords.latitude.toFixed(5)}, {record.coords.longitude.toFixed(5)}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3fdf6', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  empty: { fontStyle: 'italic', color: '#888' },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  place: { fontSize: 16, fontWeight: 'bold' },
  time: { marginTop: 4, color: '#666' },
  location: { marginTop: 2, color: '#666' },
});
