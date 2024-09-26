import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, FlatList, ImageBackground, TouchableOpacity } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { auth } from '../../FirebaseConfig';
import { NavigationProp } from '@react-navigation/native';
import { useDarkMode } from './DarkModeContext'; // Import dark mode context

interface TireData {
  id: string;
  Date: string;
  Time: string;
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
  
        // Filter by entered tire number
        const filteredTireData = tireDataArray.filter((tire) => {
          return tire.id.toLowerCase() === tireNumber.toLowerCase();
        });
  
        // Sort by combined Date and Time
        const sortedTireData = filteredTireData
          .sort((a, b) => {
            // Combine Date and Time fields to create a valid Date object
            const dateA = new Date(`${a.Date} ${a.Time}`).getTime();
            const dateB = new Date(`${b.Date} ${b.Time}`).getTime();
            return dateB - dateA; // Descending order
          })
          .slice(0, 4); // Get the last 4 entries
  
        setTireData(sortedTireData);
        setOriginalTireData(sortedTireData); // Save the original sorted data
      }
    });
  }, [tireNumber]);
  
  
  
  
  

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
    if (tyrePressure >= 45) {
      return '#149414';
    } else if (tyrePressure >= 42 && tyrePressure < 45) {
      return 'yellow';
    } else if (tyrePressure < 41){
      return 'red';
    }
  };

  const getThreadDepthColor = (threadDepth: number) => {
    if (threadDepth >= 10) {
      return '#149414';
    } else if (threadDepth >= 5 && threadDepth < 10) {
      return 'yellow';
    } else if(threadDepth <= 4){
      return 'red';
    }
  };

  const getTireStatus = (tyrePressure: number, threadDepth: number) => {
    const tyrePressureColor = getTyrePressureColor(tyrePressure);
    const threadDepthColor = getThreadDepthColor(threadDepth);

    if (tyrePressureColor === 'red' || threadDepthColor === 'red') {
      return 'BAD';
    } else if (tyrePressureColor === 'yellow' || threadDepthColor === 'yellow') {
      return 'CHECK';
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
          <Text style={[styles.modalTitle, isDarkMode ? styles.darkmodalTitle: styles.lightmodalTitle]}>Tire Details</Text>
  
          {/* Conditionally render message if no data is found */}
          {noDataFound ? (
            <Text style={styles.noDataMessage}>No data found for the entered Tire Number.{"\n"}Recheck the Tire Number</Text>
          ) : (
            <>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, isDarkMode ? styles.darktableHeaderCell: styles.lighttableHeaderCell , styles.columnSpacing]}>D/M</Text>
                <Text style={[styles.tableHeaderCell, isDarkMode ? styles.darktableHeaderCell: styles.lighttableHeaderCell , styles.columnSpacing]}>V No</Text>
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
                  const [month, day] = item.Date.split('/');
                  const vehicleLetters = item.vehicleNo.slice(0, 2);
                  const vehicleNumbers = item.vehicleNo.slice(2);
  
                  return (
                    <View>
                      <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, isDarkMode ? styles.darktableCell: styles.lighttableCell, styles.columnSpacing]}>{`${day}/${month}`}</Text>
                        <Text style={[styles.tableCell, isDarkMode ? styles.darktableCell: styles.lighttableCell, styles.columnSpacing]}>
                          {`${vehicleLetters}\n${vehicleNumbers}`}
                        </Text>
                        <Text style={[styles.tableCell, isDarkMode ? styles.darktableCell: styles.lighttableCell, styles.columnSpacing]}>{item.TirePosition}</Text>
                        <Text
                          style={[styles.tableCell, { color: getTyrePressureColor(item.tyrePressure) }, styles.columnSpacing]}
                        >
                          {item.tyrePressure}
                        </Text>
                        <Text
                          style={[styles.tableCell, { color: getThreadDepthColor(item.threadDepth) }, styles.columnSpacing]}
                        >
                          {item.threadDepth}
                        </Text>
                        <Text style={[styles.tableCell, isDarkMode ? styles.darktableCell: styles.lighttableCell, styles.columnSpacing]}>
                          {getTireStatus(item.tyrePressure, item.threadDepth)}
                        </Text>
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
  container: {
    flex: 1,
    padding: 16,
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
    width: '93%',
    height:'55%',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth:2
  },
  darkmodalContainer: {
    borderColor: 'white', 
  },
  lightmodalContainer: {
    borderColor: '#000',
  },
  darkmodalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: 'white', 
  },
  lightmodalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'black',
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
    alignItems:'center',
  },
  noDataMessage: {
    fontSize: 12,
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
    paddingBottom:40,
  },
});

export default ViewData;
