import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 获取所有已打卡记录（place 名字数组）
 */
export const getCheckedInPlaces = async () => {
  try {
    const data = await AsyncStorage.getItem('checkin_records');
    if (!data) return [];
    const records = JSON.parse(data);
    return records.map(r => r.place);
  } catch (error) {
    console.error('Failed to get check-in records:', error);
    return [];
  }
};

/**
 * 判断某个打卡点是否已经打卡过
 * @param {string} placeName - 打卡点名称
 */
export const isPlaceCheckedIn = async (placeName) => {
  const checkedInPlaces = await getCheckedInPlaces();
  return checkedInPlaces.includes(placeName);
};
