import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, FlatList, ImageBackground, TouchableOpacity } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { auth } from '../../FirebaseConfig'; // Adjust path as needed
import { useDarkMode } from './DarkModeContext'; // Import dark mode context


interface TireData {
  id: string;
  Date: string;
  Time: string;
  vehicleNo: string;
  TirePosition: string;
  tyrePressure: number;
  threadDepth: number;
  tireNo: string;
}

const VehicleData: React.FC = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [tireData, setTireData] = useState<TireData[]>([]);
  const [originalTireData, setOriginalTireData] = useState<TireData[]>([]);

  const [vehicleNumber, setVehicleNumber] = useState<string>('');
  const [vehicleNumberError, setVehicleNumberError] = useState<string>('');

  const [noDataFound, setNoDataFound] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { isDarkMode } = useDarkMode(); // Use dark mode context


  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
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
    if (vehicleNumber.trim() === '') {
      setTireData(originalTireData);
      return;
    }
  
    const filteredData = originalTireData.filter((tire) => {
      const vehicleNo = tire.vehicleNo || '';
      return vehicleNo.toLowerCase() === vehicleNumber.toLowerCase();
    });
  
    // Group tire data by position and get the latest date for each position
    const groupedData = filteredData.reduce((acc: Record<string, TireData>, tire) => {
      const position = tire.TirePosition;
      const date = tire.Date;
      if (!acc[position] || date > acc[position].Date) {
        acc[position] = tire;
      }
      return acc;
    }, {});
  
    // Convert the grouped data back to an array
    const latestData = Object.values(groupedData);
  
    setNoDataFound(latestData.length === 0);
    setTireData(latestData);
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
    <View style={[styles.modalContainer, isDarkMode ? styles.darkmodalContainer: styles.lightmodalContainer]}>
      <View style={[styles.modalContent, isDarkMode ? styles.darkmodalContent: styles.lightmodalContent]}>
        <Text style={[styles.modalTitle, isDarkMode ? styles.darkmodalTitle: styles.lightmodalTitle]}>Tire Details of Vehicle  {vehicleNumber.slice(0, 2).toUpperCase() + vehicleNumber.slice(2)}</Text>

        {/* Conditionally render message if no data is found */}
        {noDataFound ? (
          <Text style={styles.noDataMessage}>No data found for the entered Vehicle Number.{"\n"}Recheck the Vehicle Number</Text>
        ) : (
          <>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, isDarkMode ? styles.darktableHeaderCell: styles.lighttableHeaderCell , styles.columnSpacing]}>D/M</Text>
              <Text style={[styles.tableHeaderCell, isDarkMode ? styles.darktableHeaderCell: styles.lighttableHeaderCell , styles.columnSpacing]}>T No</Text>
              <Text style={[styles.tableHeaderCell, isDarkMode ? styles.darktableHeaderCell: styles.lighttableHeaderCell , styles.columnSpacing]}>Position</Text>
              <Text style={[styles.tableHeaderCell, isDarkMode ? styles.darktableHeaderCell: styles.lighttableHeaderCell , styles.columnSpacing]}>Pressure</Text>
              <Text style={[styles.tableHeaderCell, isDarkMode ? styles.darktableHeaderCell: styles.lighttableHeaderCell , styles.columnSpacing]}>Depth</Text>
              <Text style={[styles.tableHeaderCell, isDarkMode ? styles.darktableHeaderCell: styles.lighttableHeaderCell , styles.columnSpacing]}>Status</Text>
            </View>

            {/* Horizontal line below header */}
            <View style={[styles.horizontalLine, isDarkMode ? styles.darkhorizontalLine: styles.lighthorizontalLine]}/>

            <FlatList
              data={tireData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const dateParts = item.Date.split('/');
                const formattedDate = `${dateParts[1]}/${dateParts[0]}`;

                return (
                  <View>
                    <View style={styles.tableRow}>
                      <Text style={[styles.tableCell, isDarkMode ? styles.darktableCell: styles.lighttableCell, styles.columnSpacing]}>{formattedDate}</Text>
                      <Text style={[styles.tableCell, isDarkMode ? styles.darktableCell: styles.lighttableCell, styles.columnSpacing]}>{item.tireNo}</Text>
                      <Text style={[styles.tableCell, isDarkMode ? styles.darktableCell: styles.lighttableCell, styles.columnSpacing]}>{item.TirePosition}</Text>
                      <Text style={[styles.tableCell, { color: getTyrePressureColor(item.tyrePressure) }]}>{item.tyrePressure}</Text>
                      <Text style={[styles.tableCell, { color: getThreadDepthColor(item.threadDepth) }]}>{item.threadDepth}</Text>
                      <Text style={[styles.tableCell, isDarkMode ? styles.darktableCell: styles.lighttableCell, styles.columnSpacing]}>{getTireStatus(item.tyrePressure, item.threadDepth)}</Text>
                    </View>
                    <View  style={[styles.horizontalLine, isDarkMode ? styles.darkhorizontalLine: styles.lighthorizontalLine]} />
                  </View>
                );
              }}
            />
          </>
        )}
        <View style = {styles.buttonContainer}>
          <TouchableOpacity onPress={() => setIsModalOpen(false)}  style={[styles.uploadButton, isDarkMode ? styles.darkuploadButton : styles.lightuploadButton]}>
              <Text style={[styles.uploadButtonText, isDarkMode ? styles.darkuploadButtonText : styles.lightuploadButtonText]}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </Modal>
  );

  return (
    <ImageBackground
      source={require('./images/BG2.png')} // Replace with your image path
      style={styles.backgroundImage}
    >
      <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.header, isDarkMode ? styles.darkuploadButtonText : styles.lightuploadButtonText]}>View vehicle Data</Text>
      {authUser ? (
          <View style={styles.innerContainer}>
            <View  style={[styles.searchContainer, isDarkMode ? styles.darksearchContainer : styles.lightsearchContainer]}>
                <Text style={[styles.label, isDarkMode ? styles.darkLabel : styles.lightLabel]}>Vehicle Number</Text>
                <View>
                  <TextInput
                    style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                    placeholder="Eg: PM0006"
                    placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
                    value={vehicleNumber}
                    onChangeText={(text) => {
                      const vehicleNumberRegex = /^[A-Za-z]{2}\d{4}$/;
                      if (!vehicleNumberRegex.test(text)) {
                        setVehicleNumberError('Vehicle number must be with two letters followed by 4 digits');
                      } else {
                        setVehicleNumberError('');
                      }
                      setVehicleNumber(text);
                    }}
                  />
                  {vehicleNumberError && (
                    <Text style={{ color: 'red', fontSize: 14, marginBottom: 8, alignSelf:'center'}}>
                      {vehicleNumberError}
                    </Text>
                  )}
                </View>
                
                <View style = {styles.buttonContainer}>
                <TouchableOpacity onPress={handleSearch} style={[styles.uploadButton, isDarkMode ? styles.darkuploadButton : styles.lightuploadButton]}>
                  <Text style={[styles.uploadButtonText, isDarkMode ? styles.darkuploadButtonText : styles.lightuploadButtonText]}>Search</Text>
                </TouchableOpacity>
              </View>
            </View>
            <ModalTable />
          </View>
        ) : (
          <Text>Please log in to view your tire data.</Text>
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
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    fontSize: 13,
    alignSelf:'center'
  },
  darktableHeaderCell: {
    color:"white"
  },
  lighttableHeaderCell: {
    color:"black"
  },
  horizontalLine: {
    height: 1,              // Set the height of the line
    backgroundColor: '#ccc', // Set the color of the line
    marginVertical: 5,      // Optional: Add some vertical margin
  },
  darkhorizontalLine: {
    backgroundColor: 'white', // Set the color of the line
  },
  lighthorizontalLine: {
    backgroundColor: '#ccc', // Set the color of the line
  },
  columnSpacing: {
    marginRight: 12, // Adjust this value as needed
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
  buttonContainer:{
    alignItems:'center'
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginBottom:60,
    marginTop:60,
  },
  modalContent: {
    width: '93%',
    
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth:2
  },
  darkmodalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: 'white', 
  },
  lightmodalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'black',
  },
  darkmodalContainer: {
    borderColor: 'white', 
  },
  lightmodalContainer: {
    borderColor: '#000',
  },
  modalTitle: {
    fontSize: 19,
    marginBottom: 40,
    alignSelf:'center'
  },
  darkmodalTitle: {
    color: '#fff',
  },
  lightmodalTitle: {
    color: 'black',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize:12,
  },
  darktableCell: {
    color:"white"
  },
  lighttableCell: {
    color:"black"
  },
  noDataMessage: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
    paddingBottom:40,
  },

  
});

export default VehicleData;
