import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Modal,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { db } from '../../FirebaseConfig';
import { ref, set } from 'firebase/database';
import { Picker } from '@react-native-picker/picker';
import { useDarkMode } from './DarkModeContext';

type VehicleType =
  | 'Prime Mover'
  | 'Terminal Transport'
  | 'Prime Mover Internal'
  | 'Internal Transport'
  | 'Small Forklift'
  | 'Rings Tractor'
  | 'Rubber Tire Granty Crane';
type TireOption = string;

const EnterData = () => {
  const [tireNo, setTireNo] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [tyrePressure, setTyrePressure] = useState('');
  const [kmReading, setKmReading] = useState('');
  const [threadDepth, setThreadDepth] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | ''>('');
  const [selectedOption1, setSelectedOption1] = useState<TireOption>('');
  const [selectedOption2, setSelectedOption2] = useState<TireOption>('');
  const [selectedOption3, setSelectedOption3] = useState<TireOption>('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const yyyy = today.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  });
  const [showPopup, setShowPopup] = useState(false);
  const [enteredData, setEnteredData] = useState('');
  const { isDarkMode } = useDarkMode();


  const handleVehicleSelect = (vehicleType: VehicleType) => {
    setSelectedVehicleType(vehicleType);
  };

  const handleSelectChange1 = (itemValue: TireOption) => {
    setSelectedOption1(itemValue);
  };

  const handleSelectChange2 = (itemValue: TireOption) => {
    setSelectedOption2(itemValue);
  };

  const handleSelectChange3 = (itemValue: TireOption) => {
    setSelectedOption3(itemValue);
  };

  const handleFormSubmit = () => {
    if (
      !tireNo ||
      !vehicleNo ||
      !tyrePressure ||
      !threadDepth ||
      !selectedVehicleType ||
      !selectedOption1 ||
      !selectedOption2 ||
      !selectedOption3 ||
      !kmReading
    ) {
      Alert.alert('Please fill in all required fields');
      return;
    }

    const enteredData = `
      Vehicle Type: ${selectedVehicleType}\n
      Vehicle Number: ${vehicleNo}\n
      Tire Serial Number: ${tireNo}\n
      Km Reading: ${kmReading}\n
      Tire Status: ${selectedOption2}\n
      Tire Brand: ${selectedOption3}\n
      Tire Position: ${selectedOption1}\n
      Thread Depth: ${threadDepth}\n
      Air Pressure: ${tyrePressure}\n`;

    setEnteredData(enteredData);
    setShowPopup(true);
  };

  const handlePopupConfirm = () => {
    const userRef = ref(db, `TireData/${date}/${tireNo}`);
    set(userRef, {
      vehicleNo: vehicleNo,
      tireNo: tireNo,
      tyrePressure: tyrePressure,
      threadDepth: threadDepth,
      kmReading: kmReading,
      vehicleType: selectedVehicleType,
      TirePosition: selectedOption1,
      tirestatus: selectedOption2,
      tirebrand: selectedOption3,
      dateTime: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      }),
    })
      .then(() => {
        Alert.alert('Data entered successfully!');
        setShowPopup(false);
      })
      .catch((error) => {
        Alert.alert('Error entering data', error.message);
        setShowPopup(false);
      });
  };

  const handlePopupCancel = () => {
    setShowPopup(false);
  };

  return (
    <ImageBackground source={require('./images/BG2.png')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={[styles.scrollContainer, isDarkMode ? styles.darkscrollContainer : styles.lightscrollContainer]}>
        <View style={styles.container}>
          <Text style={[styles.header, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>Enter Data</Text>

          <View style={styles.vehicleSelectionContainer}>
            <Text style={[styles.inputText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>Select Vehicle Type:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={[styles.buttonContainer, isDarkMode ? styles.darkbuttonContainer : styles.lightbuttonContainer]}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleVehicleSelect('Prime Mover') }
                >
                  <Image source={require('./images/PM.png')} style={styles.vehicleImage} />
                  <Text style={[styles.vehicleText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>PM</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.buttonContainer, isDarkMode ? styles.darkbuttonContainer : styles.lightbuttonContainer]}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleVehicleSelect('Terminal Transport')}
                >
                  <Image source={require('./images/TT.png')} style={styles.vehicleImage} />
                  <Text style={[styles.vehicleText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>TT</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.buttonContainer, isDarkMode ? styles.darkbuttonContainer : styles.lightbuttonContainer]}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleVehicleSelect('Prime Mover Internal')}
                >
                  <Image source={require('./images/PM.png')} style={styles.vehicleImage} />
                  <Text style={[styles.vehicleText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>IPM</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.buttonContainer, isDarkMode ? styles.darkbuttonContainer : styles.lightbuttonContainer]}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleVehicleSelect('Internal Transport')}
                >
                  <Image source={require('./images/IT.png')} style={styles.vehicleImage} />
                  <Text style={[styles.vehicleText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>IT</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.buttonContainer, isDarkMode ? styles.darkbuttonContainer : styles.lightbuttonContainer]}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleVehicleSelect('Small Forklift')}
                >
                  <Image source={require('./images/FS.png')} style={styles.vehicleImage} />
                  <Text style={[styles.vehicleText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>FS</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.buttonContainer, isDarkMode ? styles.darkbuttonContainer : styles.lightbuttonContainer]}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleVehicleSelect('Rings Tractor')}
                >
                  <Image source={require('./images/RS.png')} style={styles.vehicleImage} />
                  <Text style={[styles.vehicleText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>RS</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.buttonContainer, isDarkMode ? styles.darkbuttonContainer : styles.lightbuttonContainer]}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleVehicleSelect('Rubber Tire Granty Crane')}
                >
                  <Image source={require('./images/RTG.png')} style={styles.vehicleImage} />
                  <Text style={[styles.vehicleText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>RTG</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>Vehicle Number:</Text>
            <TextInput
              value={vehicleNo}
              onChangeText={(text) => setVehicleNo(text)}
              placeholder="Enter Vehicle Number"
              placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
              style={[styles.input, isDarkMode ? styles.darkinput : styles.lightinput]}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>Tire Serial Number:</Text>
            <TextInput
              value={tireNo}
              onChangeText={(text) => setTireNo(text)}
              placeholder="Enter Tire Serial Number"
              placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
              style={[styles.input, isDarkMode ? styles.darkinput : styles.lightinput]}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>Km Reading:</Text>
            <TextInput
              value={kmReading}
              onChangeText={(text) => setKmReading(text)}
              placeholder="Enter Km Reading"
              placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
              style={[styles.input, isDarkMode ? styles.darkinput : styles.lightinput]}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>Tire Position:</Text>
            <Picker
              selectedValue={selectedOption1}
              onValueChange={handleSelectChange1}
              style={[styles.picker, isDarkMode ? styles.darkinput : styles.lightinput]}
            >
              <Picker.Item label="Front Left" value="Front Left" />
              <Picker.Item label="Front Right" value="Front Right" />
              <Picker.Item label="Rear Left" value="Rear Left" />
              <Picker.Item label="Rear Right" value="Rear Right" />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>Thread Depth:</Text>
            <TextInput
              value={threadDepth}
              onChangeText={(text) => setThreadDepth(text)}
              placeholder="Enter Thread Depth"
              placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
              style={[styles.input, isDarkMode ? styles.darkinput : styles.lightinput]}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>Air Pressure:</Text>
            <TextInput
              value={tyrePressure}
              onChangeText={(text) => setTyrePressure(text)}
              placeholder="Enter Air Pressure"
              placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
              style={[styles.input, isDarkMode ? styles.darkinput : styles.lightinput]}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>Tire Status:</Text>
            <Picker
              selectedValue={selectedOption2}
              onValueChange={handleSelectChange2}
              style={[styles.picker, isDarkMode ? styles.darkinput : styles.lightinput]}
            >
              <Picker.Item label="Good" value="Good" />
              <Picker.Item label="Worn Out" value="Worn Out" />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>Tire Brand:</Text>
            <Picker
              selectedValue={selectedOption3}
              onValueChange={handleSelectChange3}
              style={[styles.picker, isDarkMode ? styles.darkinput : styles.lightinput]}
            >
              <Picker.Item label="Brand A" value="Brand A" />
              <Picker.Item label="Brand B" value="Brand B" />
              <Picker.Item label="Brand C" value="Brand C" />
            </Picker>
          </View>
          <TouchableOpacity onPress={handleFormSubmit} style={[styles.uploadButton, isDarkMode ? styles.darkuploadButton : styles.lightuploadButton]}>
              <Text style={[styles.uploadButtonText, isDarkMode ? styles.darkuploadButtonText : styles.lightuploadButtonText]}>Upload Data</Text>
            </TouchableOpacity>
          <Modal
            transparent={true}
            visible={showPopup}
            onRequestClose={() => setShowPopup(false)}
          >
            <View style={[styles.popupContainer, isDarkMode ? styles.darkpopupContainer : styles.lightpopupContainer]}>
              <View  style={[styles.popupContent, isDarkMode ? styles.darkpopupContent : styles.lightpopupContent]}>
                <Text style={[styles.popuptitle, isDarkMode ? styles.darkdata : styles.lightdata]}>Entered Data</Text>
                <Text style={[styles.data, isDarkMode ? styles.darkdata : styles.lightdata]}>{enteredData}</Text>
                <View style={styles.popbutton}> 
                  <TouchableOpacity onPress={handlePopupConfirm} style={[styles.popupbutton, isDarkMode ? styles.darkpopupbutton : styles.lightpopupbutton]}>
                    <Text style={[styles.uploadButtonText, isDarkMode ? styles.darkuploadButtonText : styles.lightuploadButtonText]}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handlePopupCancel} style={[styles.popupbutton, isDarkMode ? styles.darkpopupbutton : styles.lightpopupbutton]}>
                    <Text style={[styles.uploadButtonText, isDarkMode ? styles.darkuploadButtonText : styles.lightuploadButtonText]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  darkscrollContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  lightscrollContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  },
  container: {
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  vehicleSelectionContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    borderWidth: 2,              // Border width for the whole button
    borderColor: '#000',         // Border color (black in this case)
    borderRadius: 10,            // Optional: Round the corners of the border
    margin: 10,
    alignItems: 'center',
  },
  darkbuttonContainer: {
    borderColor: 'white',         // Border color (black in this case)
  },
  lightbuttonContainer: {
    borderColor: '#000',         // Border color (black in this case)
  },
  selectedButtonDark: {
    borderColor: '#f39c12', // Highlight color for dark mode
    borderWidth: 2,
  },
  selectedButtonLight: {
    borderColor: '#f39c12', // Highlight color for light mode
    borderWidth: 2,
  },
  button: {
    alignItems: 'center',
    padding: 10,
  },
  vehicleImage: {
    width: 80,
    height: 50,
  },
  vehicleText: {
    textAlign: 'center',
    marginVertical: 5,
  },
  darkvehicleText:{
    color: '#fff',
  },
  lightvehicleText:{
    color: 'black',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputText:{
    fontSize: 15,
    paddingBottom:10,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
  },
  darkinput: {
    borderColor:'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
  },
  lightinput: {
    borderColor:'black',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    color: '#000',
  },
  picker: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  uploadButton: {
    padding: 10,
    borderRadius: 5,
    alignItems:'center',
    borderWidth:1,
  },
  darkuploadButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderColor:'white'
  },
  lightuploadButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkpopupContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.79)',
  },
  lightpopupContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.79)',
  },
  popupContent: {
    padding: 30,
    borderWidth:2, 
    borderRadius:9, 
    alignItems: 'center',
  },
  darkpopupContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderColor:'white',
  },
  lightpopupContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderColor:'black',
  },
  popuptitle:{
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  data:{
    fontSize: 16,
    marginBottom: 10,
  },
  lightdata:{
    color:'black'

  },
  darkdata:{
    color:'white'
  },
  popbutton:{
    flexDirection: 'row',
    justifyContent:'space-around',
    marginTop: 20,
  },
  popupbutton:{
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 1,  
  },
  lightpopupbutton:{
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  darkpopupbutton:{
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderColor:'white'
  }
});

export default EnterData;
