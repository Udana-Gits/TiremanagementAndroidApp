import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Modal, StyleSheet, ImageBackground } from 'react-native';
import { db } from '../../FirebaseConfig';
import { ref, set } from 'firebase/database';
import { Picker } from '@react-native-picker/picker';

const EnterData = () => {
  const [tireNo, setTireNo] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [tyrePressure, setTyrePressure] = useState('');
  const [kmReading, setKmReading] = useState('');
  const [threadDepth, setThreadDepth] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedOption1, setSelectedOption1] = useState('');
  const [selectedOption2, setSelectedOption2] = useState('');
  const [selectedOption3, setSelectedOption3] = useState('');
  const [date, setDate] = useState(new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: 'numeric',
  }));
  const [showPopup, setShowPopup] = useState(false);
  const [enteredData, setEnteredData] = useState('');

  const handleSelectChange1 = (itemValue: string) => {
    setSelectedOption1(itemValue);
  };

  const handleSelectChange2 = (itemValue: string) => {
    setSelectedOption2(itemValue);
  };

  const handleSelectChange3 = (itemValue: string) => {
    setSelectedOption3(itemValue);
  };

  const handleFormSubmit = () => {
    if (!tireNo || !vehicleNo || !tyrePressure || !threadDepth || !selectedOption || !selectedOption1 || !selectedOption2 || !selectedOption3 || !kmReading) {
      Alert.alert('Please fill in all required fields');
      return;
    }

    const enteredData = `
      Vehicle Type: ${selectedOption}\n
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
    const userRef = ref(db, `TireData/${date.replace(/\//g, '-')}/${tireNo}`);
    set(userRef, {
      vehicleNo: vehicleNo,
      tireNo: tireNo,
      tyrePressure: tyrePressure,
      threadDepth: threadDepth,
      kmReading: kmReading,
      vehicleType: selectedOption,
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
    <ImageBackground source={require('./images/new.jpg')}style={styles.backgroundImage}>
      <View style={styles.container}>
        <View>
          <Text style={styles.header}>Enter Data</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text>Vehicle Type:</Text>
          <Picker
            selectedValue={selectedOption}
            onValueChange={(itemValue) => setSelectedOption(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Prime Mover" value="PM" />
            <Picker.Item label="Terminal Transport" value="TT" />
            <Picker.Item label="Prime Mover Internal" value="PI" />
            <Picker.Item label="Internal Transport" value="IT" />
            <Picker.Item label="Small Forklift" value="FS" />
            <Picker.Item label="Rings Tractor" value="RS" />
            <Picker.Item label="Rubber Tire Granty Crane" value="RTG" />
          </Picker>
        </View>
        <View style={styles.inputContainer}>
          <Text>Vehicle Number:</Text>
          <TextInput
            value={vehicleNo}
            onChangeText={(text) => setVehicleNo(text)}
            placeholder="Enter Vehicle Number"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text>Tire Serial Number:</Text>
          <TextInput
            value={tireNo}
            onChangeText={(text) => setTireNo(text)}
            placeholder="Enter Tire Serial Number"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text>Km Reading:</Text>
          <TextInput
            value={kmReading}
            onChangeText={(text) => setKmReading(text)}
            placeholder="Enter Km Reading"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text>Tire Position:</Text>
          <Picker
            selectedValue={selectedOption1}
            onValueChange={handleSelectChange1}
            style={styles.picker}
          >
            <Picker.Item label="Front Left" value="Front Left" />
            <Picker.Item label="Front Right" value="Front Right" />
            <Picker.Item label="Rear Left" value="Rear Left" />
            <Picker.Item label="Rear Right" value="Rear Right" />
          </Picker>
        </View>
        <View style={styles.inputContainer}>
          <Text>Thread Depth:</Text>
          <TextInput
            value={threadDepth}
            onChangeText={(text) => setThreadDepth(text)}
            placeholder="Enter Thread Depth"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text>Air Pressure:</Text>
          <TextInput
            value={tyrePressure}
            onChangeText={(text) => setTyrePressure(text)}
            placeholder="Enter Air Pressure"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text>Tire Status:</Text>
          <Picker
            selectedValue={selectedOption2}
            onValueChange={handleSelectChange2}
            style={styles.picker}
          >
            <Picker.Item label="New" value="New" />
            <Picker.Item label="Used" value="Used" />
            <Picker.Item label="Damaged" value="Damaged" />
          </Picker>
        </View>
        <View style={styles.inputContainer}>
          <Text>Tire Brand:</Text>
          <Picker
            selectedValue={selectedOption3}
            onValueChange={handleSelectChange3}
            style={styles.picker}
          >
            <Picker.Item label="Brand A" value="BrandA" />
            <Picker.Item label="Brand B" value="BrandB" />
            <Picker.Item label="Brand C" value="BrandC" />
          </Picker>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Submit" onPress={handleFormSubmit} color="#054AAB" />
        </View>

        <Modal visible={showPopup} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Confirm Data Entry</Text>
              <Text>{enteredData}</Text>
              <View style={styles.modalButtonContainer}>
                <Button title="Confirm" onPress={handlePopupConfirm} color="#054AAB" />
                <Button title="Cancel" onPress={handlePopupCancel} color="#054AAB" />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  buttonContainer: {
    marginTop: 16,
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
    alignItems: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});

export default EnterData;
