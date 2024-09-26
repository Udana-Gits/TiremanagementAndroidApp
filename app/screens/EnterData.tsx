import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Modal, StyleSheet, ImageBackground, TouchableOpacity, Image, ScrollView} from 'react-native';
import { db } from '../../FirebaseConfig';
import { ref, set } from 'firebase/database';
import { Picker } from '@react-native-picker/picker';
import { useDarkMode } from './DarkModeContext';

type VehicleType =
  | 'PM'
  | 'TT'
  | 'PI'
  | 'IT'
  | 'SF'
  | 'RT'
  | 'RTG';
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

  const [errorMessage1, setErrorMessage1] = useState('');
  const [errorMessage2, setErrorMessage2] = useState('');
  const [errorMessage3, setErrorMessage3] = useState('');
  const [errorMessage4, setErrorMessage4] = useState('');
  const [errorMessage5, setErrorMessage5] = useState('');



  const handleVehicleSelect = (vehicleType: VehicleType) => {
    setSelectedVehicleType(vehicleType);
  
    // Automatically set the prefix for vehicleNo and reset the numeric part
    setVehicleNo(`${vehicleType}`);
  };

  const handleVehicleNoChange = (text: string) => {
    // Ensure the input starts with the vehicle type
    const prefix = selectedVehicleType;
    const numericPart = text.slice(prefix.length).replace(/\D/g, ''); // Remove non-numeric characters
  
    // Limit the numeric part to 4 digits
    if (numericPart.length > 4) {
      setErrorMessage1('You can only enter up to 4 digits.');
    }else if(numericPart.length < 4){
      setErrorMessage1('You must enter up to 4 digits.');
    } 
    else {
      setErrorMessage1('');
    }
  
    // Update the vehicle number with the prefix and numeric part
    setVehicleNo(`${prefix}${numericPart.slice(0, 4)}`);
  };

  const handleTireNoChange = (text: string) => {
    // Only allow alphanumeric characters (letters and numbers)
    const alphanumericText = text.replace(/[^a-zA-Z0-9]/g, '');
  
    // Update the tireNo state with the filtered value
    setTireNo(alphanumericText);
  
    // Optionally, you can add error validation if needed
    if (text !== alphanumericText) {
      setErrorMessage2('Tire Serial Number can only contain letters and numbers.');
    } else {
      setErrorMessage2('');
    }
  };
  
  const handleKmReadingChange = (text: string) => {
    // Only allow numeric characters and one decimal point
    const numericText = text.replace(/[^0-9.]/g, ''); 
  
    // Ensure only one decimal point is allowed
    const validNumericText = numericText.split('.').length > 2 
      ? numericText.slice(0, numericText.lastIndexOf('.')) 
      : numericText;
  
    // Update the kmReading state with the filtered value
    setKmReading(validNumericText);
  
    // Optionally, you can add error validation if needed
    if (text !== validNumericText) {
      setErrorMessage3('KM Reading can only contain numbers and one decimal point.');
    } else {
      setErrorMessage3('');
    }
  };

  const handleThreadDepthChange = (text: string) => {
    // Only allow numeric characters
    const numericText = text.replace(/[^0-9]/g, '');

    // Update the threadDepth state with the filtered value
    setThreadDepth(numericText);

    // Optionally, you can add error validation if needed
    if (text.includes('.')) {
        setErrorMessage4('Tire Depth must be a whole number. Please round off to the nearest whole number.');
    } else if (parseInt(numericText) < 0 || parseInt(numericText) > 40) {
        setErrorMessage4('Tire Depth must be between 0 and 40.');
    } else {
        setErrorMessage4('');
    }
};

const handleTyrePressureChange = (text: string) => {
  // Only allow numeric characters
  const numericText = text.replace(/[^0-9]/g, '');

  // Update the threadDepth state with the filtered value
  setTyrePressure(numericText);

  // Optionally, you can add error validation if needed
  if (text.includes('.')) {
      setErrorMessage5('Tire Pressure must be a whole number. Please round off to the nearest whole number.');
  } else if (parseInt(numericText) < 0 || parseInt(numericText) > 160) {
      setErrorMessage5('Tire Pressure must be between 0 and 160.');
  } else {
      setErrorMessage5('');
  }
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

    if (vehicleNo === selectedVehicleType || vehicleNo.length <= selectedVehicleType.length) {
      Alert.alert('Vehicle Number is incomplete. Please enter the full vehicle number.');
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
      Date: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }),
      Time: new Date().toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
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
          <Text></Text>
          <Text style={[styles.header, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>Enter Data</Text>

          <View style={styles.vehicleSelectionContainer}>
            <Text style={[styles.inputText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>Select Vehicle Type:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={[styles.buttonContainer, isDarkMode ? styles.darkbuttonContainer : styles.lightbuttonContainer]}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleVehicleSelect('PM') }
                >
                  <Image source={require('./images/vehicles/PM.png')} style={styles.vehicleImage} />
                  <Text style={[styles.vehicleText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>PM</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.buttonContainer, isDarkMode ? styles.darkbuttonContainer : styles.lightbuttonContainer]}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleVehicleSelect('TT')}
                >
                  <Image source={require('./images/vehicles/TT.png')} style={styles.vehicleImage} />
                  <Text style={[styles.vehicleText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>TT</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.buttonContainer, isDarkMode ? styles.darkbuttonContainer : styles.lightbuttonContainer]}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleVehicleSelect('PI')}
                >
                  <Image source={require('./images/vehicles/PM.png')} style={styles.vehicleImage} />
                  <Text style={[styles.vehicleText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>IPM</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.buttonContainer, isDarkMode ? styles.darkbuttonContainer : styles.lightbuttonContainer]}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleVehicleSelect('IT')}
                >
                  <Image source={require('./images/vehicles/IT.png')} style={styles.vehicleImage} />
                  <Text style={[styles.vehicleText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>IT</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.buttonContainer, isDarkMode ? styles.darkbuttonContainer : styles.lightbuttonContainer]}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleVehicleSelect('SF')}
                >
                  <Image source={require('./images/vehicles/FS.png')} style={styles.vehicleImage} />
                  <Text style={[styles.vehicleText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>FS</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.buttonContainer, isDarkMode ? styles.darkbuttonContainer : styles.lightbuttonContainer]}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleVehicleSelect('RT')}
                >
                  <Image source={require('./images/vehicles/RS.png')} style={styles.vehicleImage} />
                  <Text style={[styles.vehicleText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>RS</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.buttonContainer, isDarkMode ? styles.darkbuttonContainer : styles.lightbuttonContainer]}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleVehicleSelect('RTG')}
                >
                  <Image source={require('./images/vehicles/RTG.png')} style={styles.vehicleImage} />
                  <Text style={[styles.vehicleText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>RTG</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>Vehicle Number:</Text>
            <TextInput
              value={vehicleNo}
              onChangeText={handleVehicleNoChange}
              placeholder="Enter Vehicle Number"
              placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
              style={[styles.input, isDarkMode ? styles.darkinput : styles.lightinput]}
              keyboardType="numeric" // Ensure only numbers are allowed
              onBlur={() => setErrorMessage1('')} // Clear error message on blur
             />
            {errorMessage1 ? (
              <Text style={{ color: 'red', marginTop: 5 }}>{errorMessage1}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>Tire Serial Number:</Text>
            <TextInput
              value={tireNo}
              onChangeText={handleTireNoChange}
              placeholder="Enter Tire Serial Number"
              placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
              style={[styles.input, isDarkMode ? styles.darkinput : styles.lightinput]}
              onBlur={() => setErrorMessage2('')} // Clear error message on blur
            />
              {errorMessage2 ? (
              <Text style={{ color: 'red', marginTop: 5 }}>{errorMessage2}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>Km Reading:</Text>
            <TextInput
              value={kmReading}
              onChangeText={handleKmReadingChange}
              placeholder="Enter Km Reading"
              placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
              style={[styles.input, isDarkMode ? styles.darkinput : styles.lightinput]}
              keyboardType="numeric"
              onBlur={() => setErrorMessage3('')} // Clear error message on blur
            />
            {errorMessage3 ? (
              <Text style={{ color: 'red', marginTop: 5 }}>{errorMessage3}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>Tire Position:</Text>
            <Picker
              selectedValue={selectedOption1}
              onValueChange={handleSelectChange1}
              style={[styles.picker, isDarkMode ? styles.darkinput : styles.lightinput]}
            >
              <Picker.Item label="P #01" value="P #01" />
              <Picker.Item label="P #02" value="P #02" />
              <Picker.Item label="P #03" value="P #03" />
              <Picker.Item label="P #04" value="P #04" />
              <Picker.Item label="P #05" value="P #05" />
              <Picker.Item label="P #06" value="P #06" />
              <Picker.Item label="P #07" value="P #07" />
              <Picker.Item label="P #08" value="P #08" />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>Thread Depth:</Text>
            <TextInput
              value={threadDepth}
              onChangeText={handleThreadDepthChange}
              placeholder="Enter Thread Depth"
              placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
              style={[styles.input, isDarkMode ? styles.darkinput : styles.lightinput]}
              keyboardType="numeric"
            />
            {errorMessage4 ? (
              <Text style={{ color: 'red', marginTop: 5 }}>{errorMessage4}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>Air Pressure:</Text>
            <TextInput
              value={tyrePressure}
              onChangeText={handleTyrePressureChange}
              placeholder="Enter Air Pressure"
              placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
              style={[styles.input, isDarkMode ? styles.darkinput : styles.lightinput]}
              keyboardType="numeric"
            />
            {errorMessage5 ? (
              <Text style={{ color: 'red', marginTop: 5 }}>{errorMessage5}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>Tire Status:</Text>
            <Picker
              selectedValue={selectedOption2}
              onValueChange={handleSelectChange2}
              style={[styles.picker, isDarkMode ? styles.darkinput : styles.lightinput]}
            >
              <Picker.Item label="New" value="New" />
              <Picker.Item label="Rebuild" value="Rebuild" />
              <Picker.Item label="Broken" value="Broken" />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputText, isDarkMode ? styles.darkvehicleText : styles.lightvehicleText]}>Tire Brand:</Text>
            <Picker
              selectedValue={selectedOption3}
              onValueChange={handleSelectChange3}
              style={[styles.picker, isDarkMode ? styles.darkinput : styles.lightinput]}
            >
              <Picker.Item label="Magna" value="Magna" />
              <Picker.Item label="GSR" value="GSR" />
              <Picker.Item label="Continantal" value="Continantal" />
              <Picker.Item label="Westlake" value="Westlake" />
              <Picker.Item label="JK" value="JK" />
              <Picker.Item label="Michalin" value="Michalin" />
              <Picker.Item label="Advance" value="Advance" />
              <Picker.Item label="Annaite" value="Annaite" />
              <Picker.Item label="Jetsteel" value="Jetsteel" />
              <Picker.Item label="Jetway" value="Jetway" />
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
