import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles/DiaryStyles';

// ✅ 替代 uuid 的函数
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

export default function DiaryScreen() {
  const [records, setRecords] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingNoteText, setEditingNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [])
  );

  const loadRecords = async () => {
    const data = await AsyncStorage.getItem('checkin_records');
    if (data) {
      setRecords(JSON.parse(data).reverse());
    }
  };

  const saveRecords = async (updatedRecords) => {
    const reversed = [...updatedRecords].reverse();
    await AsyncStorage.setItem('checkin_records', JSON.stringify(reversed));
    setRecords(updatedRecords);
  };

  const deleteRecord = async (indexToDelete) => {
    Alert.alert('Delete Record', 'Are you sure you want to delete this check-in?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const reversed = [...records].reverse();
          reversed.splice(indexToDelete, 1);
          await saveRecords(reversed);
        },
      },
    ]);
  };

  const formatTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const addNote = async (index) => {
    const updated = [...records];
    const newNote = {
      id: generateId(),
      text: editingNoteText,
      image: null,
      time: new Date().toISOString(),
    };
    updated[index].notes = updated[index].notes || [];
    if (updated[index].notes.length >= 3) {
      Alert.alert('Limit Reached', 'You can only add up to 3 notes.');
      return;
    }
    updated[index].notes.push(newNote);
    await saveRecords(updated.reverse());
    setEditingIndex(null);
    setEditingNoteText('');
  };

  const updateNote = async (recordIndex, noteId, newText) => {
    const updated = [...records];
    const note = updated[recordIndex].notes.find((n) => n.id === noteId);
    if (note) note.text = newText;
    await saveRecords(updated.reverse());
    setEditingIndex(null);
    setEditingNoteId(null);
    setEditingNoteText('');
  };

  const deleteNote = async (recordIndex, noteId) => {
    const updated = [...records];
    updated[recordIndex].notes = updated[recordIndex].notes.filter((n) => n.id !== noteId);
    await saveRecords(updated.reverse());
  };

  const updateNoteImage = async (recordIndex, noteId) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const updated = [...records];
      const note = updated[recordIndex].notes.find((n) => n.id === noteId);
      if (note) note.image = result.assets[0].uri;
      await saveRecords(updated.reverse());
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📖 My Check-in Diary</Text>
      {records.length === 0 ? (
        <Text style={styles.empty}>No check-in records yet.</Text>
      ) : (
        records.map((record, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.place}>{record.place}</Text>
              <TouchableOpacity onPress={() => deleteRecord(records.length - 1 - index)}>
                <Ionicons name="trash" size={20} color="#f44336" />
              </TouchableOpacity>
            </View>
            <Text style={styles.time}>🕒 {formatTime(record.time)}</Text>
            <Text style={styles.location}>
              📍 {record.coords.latitude.toFixed(5)}, {record.coords.longitude.toFixed(5)}
            </Text>

            {record.notes?.map((note) => (
              <View key={note.id} style={styles.noteBlock}>
                <Text style={styles.noteTime}>🗓️ {formatTime(note.time)}</Text>
                {note.image && <Image source={{ uri: note.image }} style={styles.image} />}
                {editingIndex === index && editingNoteId === note.id ? (
                  <>
                    <TextInput
                      value={editingNoteText}
                      onChangeText={setEditingNoteText}
                      style={styles.noteInput}
                      placeholder="Update your note..."
                    />
                    <TouchableOpacity onPress={() => updateNote(index, note.id, editingNoteText)}>
                      <Text style={styles.saveButton}>💾 Save Note</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text style={styles.note}>📝 <Text style={{ fontStyle: 'italic' }}>{note.text}</Text></Text>
                )}
                <View style={styles.editRow}>
                  <TouchableOpacity onPress={() => {
                    setEditingIndex(index);
                    setEditingNoteId(note.id);
                    setEditingNoteText(note.text);
                  }}>
                    <Text style={styles.editButton}>✏️ Edit Note</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => updateNoteImage(index, note.id)}>
                    <Text style={styles.editButton}>🖼️ Change Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteNote(index, note.id)}>
                    <Text style={styles.deleteNoteButton}>🗑️ Delete Note</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {editingIndex === index && editingNoteId === null && (
              <>
                <TextInput
                  value={editingNoteText}
                  onChangeText={setEditingNoteText}
                  style={styles.noteInput}
                  placeholder="Add a new note..."
                />
                <TouchableOpacity onPress={() => addNote(index)}>
                  <Text style={styles.saveButton}>✅ Add Note</Text>
                </TouchableOpacity>
              </>
            )}

            {record.notes?.length < 3 && editingIndex !== index && (
              <TouchableOpacity
                onPress={() => {
                  setEditingIndex(index);
                  setEditingNoteId(null);
                  setEditingNoteText('');
                }}>
                <Text style={styles.addNoteButton}>➕ Add New Note</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}
