// styles/DiaryStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3fdf6',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  empty: {
    fontStyle: 'italic',
    color: '#888',
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  place: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    marginTop: 4,
    color: '#666',
  },
  location: {
    marginTop: 2,
    color: '#666',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginTop: 10,
  },
  note: {
    marginTop: 6,
    fontStyle: 'italic',
    color: '#333',
  },
  editRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  editButton: {
    fontSize: 14,
    color: '#00695c',
  },
  noteInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
    fontSize: 14,
  },
  saveButton: {
    fontSize: 14,
    marginTop: 6,
    color: '#00695c',
    textAlign: 'right',
  },
  subNoteContainer: {
    marginTop: 10,
    backgroundColor: '#f0faf8',
    borderRadius: 8,
    padding: 10,
  },
  subNoteTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  subNoteText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  subNoteImage: {
    width: '100%',
    height: 140,
    borderRadius: 6,
    marginBottom: 6,
  },
  subNoteActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subNoteButton: {
    fontSize: 13,
    color: '#00796b',
  },
  addNoteSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  addNoteTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 14,
  },
  addNoteInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    fontSize: 14,
  },
  addNoteButton: {
    fontSize: 14,
    textAlign: 'center',
    color: '#00695c',
  },
});
