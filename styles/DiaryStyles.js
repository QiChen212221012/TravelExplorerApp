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
    marginBottom: 6,
  },
  noteBlock: {
    marginTop: 10,
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#e0f0e8',
    backgroundColor: '#f4fbf8',
    borderRadius: 10,
  },
  noteTime: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
  },
  note: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    marginTop: 4,
  },
  editRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
  },
  editButton: {
    fontSize: 13,
    color: '#0a7b61',
    marginRight: 10,
  },
  deleteNoteButton: {
    fontSize: 13,
    color: '#cc0000',
  },
  noteInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  saveButton: {
    color: '#00695c',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 6,
    textAlign: 'right',
  },
  addNoteButton: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#0a7b61',
  },
});
