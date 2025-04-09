// screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps'; // 显示地图和标记点
import * as Location from 'expo-location'; // 获取定位权限和位置

import { checkpoints } from '../checkpoints'; // 自定义打卡点数据
import { getDistanceFromLatLonInMeters } from '../utils/location'; // 计算两点间距离

export default function HomeScreen({ navigation }) {
  const [location, setLocation] = useState(null); // 当前用户位置
  const [nearestPoint, setNearestPoint] = useState(null); // 附近的打卡点
  const [errorMsg, setErrorMsg] = useState(''); // 错误信息

  useEffect(() => {
    // 请求定位权限并获取当前位置
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  useEffect(() => {
    // 每次位置更新时检查是否靠近某个打卡点
    if (location) {
      const near = checkpoints.find((point) => {
        const distance = getDistanceFromLatLonInMeters(
          location.latitude,
          location.longitude,
          point.latitude,
          point.longitude
        );
        return distance < 50; // 50 米内算“已进入”
      });
      setNearestPoint(near || null);
    }
  }, [location]);

  if (errorMsg) return <Text>{errorMsg}</Text>; // 权限错误提示
  if (!location) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />; // 加载中

  return (
    <View style={styles.container}>
      {/* 地图视图 */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation // 显示蓝点
      >
        {/* 打卡点标记 */}
        {checkpoints.map((cp) => (
          <Marker
            key={cp.id}
            coordinate={{ latitude: cp.latitude, longitude: cp.longitude }}
            title={cp.name}
          />
        ))}
      </MapView>

      {/* 信息栏 */}
      <View style={styles.info}>
        {nearestPoint ? (
          <>
            <Text>✅ Checkpoint reached: {nearestPoint.name}</Text>
            <Button title="Go to Check-in Page" onPress={() => navigation.navigate('Check In')} />
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
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
});
