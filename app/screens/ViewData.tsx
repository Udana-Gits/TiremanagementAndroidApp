import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, FlatList, ImageBackground, TouchableOpacity } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { auth } from '../../FirebaseConfig'; // Adjust the path to your firebase config
import { NavigationProp } from '@react-navigation/native';
import Header from './Header'; // Adjust path as needed
import Footer from './Footer';

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
      source={require('./images/new1.jpg')} // Replace with the path to your image
      style={styles.backgroundImage}
    >
      <Header/>
      <View style={styles.container}>
        
        {authUser ? (
          <View style={styles.innerContainer}>
            <Text style={styles.label}>Tire Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Eg: T01"
              value={tireNumber}
              onChangeText={(text) => setTireNumber(text)}
            />
            <Button title="Search" onPress={handleSearch} color="#054AAB" />
            {noDataFound && <Text>No data found for the entered Tire Number.</Text>}
            <ModalTable />
          </View>
        ) : (
          <Text>Please sign in to access Tire Data.</Text>
        )}
      </View>
      <Footer/>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // Slightly transparent background
  },
  backgroundImage: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 20,
    backgroundColor: 'blue',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: 'white',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
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
});

export default ViewData;
