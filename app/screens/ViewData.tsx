import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, FlatList, ImageBackground, TouchableOpacity } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { auth } from '../../FirebaseConfig';
import { NavigationProp } from '@react-navigation/native';
import { useDarkMode } from './DarkModeContext'; // Import dark mode context

interface TireData {
  id: string;
  dateTime: string;
  vehicleNo: string;
  TirePosition: string;
  tyrePressure: number;
  threadDepth: number;
}

interface ViewDataProps {
  navigation: NavigationProp<any>;
}

const ViewData: React.FC<ViewDataProps> = ({ navigation }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [tireData, setTireData] = useState<TireData[]>([]);
  const [originalTireData, setOriginalTireData] = useState<TireData[]>([]);
  const [tireNumber, setTireNumber] = useState<string>('');
  const [noDataFound, setNoDataFound] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { isDarkMode } = useDarkMode(); // Use dark mode context

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      setAuthUser(user ? user : null);
    });
    return () => listen();
  }, []);

  useEffect(() => {
    const dbRef = ref(getDatabase(), 'TireData');
    return onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tireDataArray: TireData[] = Object.keys(data).flatMap((date) =>
          Object.keys(data[date]).map((tireNo) => ({
            id: tireNo,
            ...data[date][tireNo],
          }))
        );
        setTireData(tireDataArray);
        setOriginalTireData(tireDataArray);
      }
    });
  }, []);

  const handleSearch = () => {
    if (tireNumber.trim() === '') {
      setTireData(originalTireData);
      return;
    }

    const filteredData = originalTireData.filter((tire) => {
      const tireNo = tire.id || '';
      return tireNo.toLowerCase() === tireNumber.toLowerCase();
    });

    setNoDataFound(filteredData.length === 0);
    setTireData(filteredData);
    setIsModalOpen(true);
  };

  const getTyrePressureColor = (tyrePressure: number) => {
    if (tyrePressure >= 140 && tyrePressure < 150) {
      return 'green';
    } else if (tyrePressure > 135 && tyrePressure < 140) {
      return 'yellow';
    } else {
      return 'red';
    }
  };

  const getThreadDepthColor = (threadDepth: number) => {
    if (threadDepth >= 120 && threadDepth < 125) {
      return 'green';
    } else if (threadDepth >= 115 && threadDepth < 120) {
      return 'yellow';
    } else {
      return 'red';
    }
  };

  const getTireStatus = (tyrePressure: number, threadDepth: number) => {
    const tyrePressureColor = getTyrePressureColor(tyrePressure);
    const threadDepthColor = getThreadDepthColor(threadDepth);

    if (tyrePressureColor === 'red' || threadDepthColor === 'red') {
      return 'BAD';
    } else if (tyrePressureColor === 'yellow' || threadDepthColor === 'yellow') {
      return 'BETTER TO CHECK';
    } else {
      return 'GOOD';
    }
  };

  const ModalTable = () => (
    <Modal
      visible={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Tire Details of Your Vehicle</Text>
          <FlatList
            data={tireData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.dateTime}</Text>
                <Text style={styles.tableCell}>{item.vehicleNo}</Text>
                <Text style={styles.tableCell}>{item.TirePosition}</Text>
                <Text style={[styles.tableCell, { color: getTyrePressureColor(item.tyrePressure) }]}>{item.tyrePressure}</Text>
                <Text style={[styles.tableCell, { color: getThreadDepthColor(item.threadDepth) }]}>{item.threadDepth}</Text>
                <Text style={styles.tableCell}>{getTireStatus(item.tyrePressure, item.threadDepth)}</Text>
              </View>
            )}
          />
          <Button title="Close" onPress={() => setIsModalOpen(false)} color="#054AAB" />
        </View>
      </View>
    </Modal>
  );

  return (
    <ImageBackground
      source={require('./images/BG2.png')}
      style={styles.backgroundImage}
    >
      <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.header, isDarkMode ? styles.darkuploadButtonText : styles.lightuploadButtonText]}>View Tire Data</Text>
        {authUser ? (
          <View style={styles.innerContainer}>
            <View  style={[styles.searchContainer, isDarkMode ? styles.darksearchContainer : styles.lightsearchContainer]}>
              <Text style={[styles.label, isDarkMode ? styles.darkLabel : styles.lightLabel]}>Tire Number</Text>
              <TextInput
                style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                placeholder="Eg: T01"
                placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
                value={tireNumber}
                onChangeText={(text) => setTireNumber(text)}
              />
              <View style = {styles.buttonContainer}>
                <TouchableOpacity onPress={handleSearch} style={[styles.uploadButton, isDarkMode ? styles.darkuploadButton : styles.lightuploadButton]}>
                  <Text style={[styles.uploadButtonText, isDarkMode ? styles.darkuploadButtonText : styles.lightuploadButtonText]}>Search</Text>
                </TouchableOpacity>
              </View>
              {noDataFound && <Text style={isDarkMode ? styles.darkLabel : styles.lightLabel}>No data found for the entered Tire Number.</Text>}
            </View>
            <ModalTable />
          </View>
        ) : (
          <Text style={isDarkMode ? styles.darkLabel : styles.lightLabel}>Please sign in to access Tire Data.</Text>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  darkContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  lightContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  backgroundImage: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginBottom:-90,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  searchContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth:1,
  },
  darksearchContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  lightsearchContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor:'black'
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  darkLabel: {
    color: '#fff',
  },
  lightLabel: {
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  darkInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    borderColor: '#fff',
  },
  lightInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#000',
    borderColor: '#ccc',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  uploadButton: {
    padding: 10,
    borderRadius: 5,
    alignItems:'center',
    width:150,
    borderWidth:1,
  },
  darkuploadButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderColor: '#fff',
  },
  lightuploadButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  uploadButtonText: {
    fontSize: 16,
  },
  darkuploadButtonText: {
    color: '#fff',
  },
  lightuploadButtonText: {
    color: '#000',
  },
  buttonContainer:{
    alignItems:'center'
  },
});

export default ViewData;
