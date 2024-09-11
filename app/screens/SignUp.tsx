import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, View, TouchableOpacity, TextInput, ImageBackground, Image } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../FirebaseConfig';
import { ref, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { useDarkMode } from './DarkModeContext';
import { Picker } from '@react-native-picker/picker';

type Occupation = string;

const SignUp: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<Occupation>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>('');
  const { isDarkMode, setIsDarkMode } = useDarkMode();
  const navigation = useNavigation();

  const handleSelectChange = (itemValue: Occupation) => {
    setSelectedOption(itemValue);
  };

  const signUp = async () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created:', userCredentials);
      const userRef = ref(db, `UserauthList/${userCredentials.user.uid}`);
      await set(userRef, {
        firstName,
        lastName,
        email,
        occupation: selectedOption,
        profilePicture: 'https://firebasestorage.googleapis.com/v0/b/tiremngdtbase.appspot.com/o/profilePictures%2Fdefault.jpg?alt=media&token=8ad886f5-29e0-459e-a29a-d3db94fc9857',
      });
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('./images/BG2.png')} // Replace with the correct image path
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView style={[styles.container, isDarkMode ? styles.darkcontainer : styles.lightcontainer]} behavior="padding">
        <View style={styles.headerContainer}>
          <Image
            source={isDarkMode ? require('./images/header.png') : require('./images/header1.png')} // Replace with the correct image path
            style={styles.logoImage}
          />
        </View>
        <View style={styles.mainContainer}>
          <View style={[styles.transparentContainer, isDarkMode ? styles.darkMode : styles.lightMode]}>
            <Text style={[styles.signuptopic, isDarkMode ? styles.darkText : styles.lightText]}>SIGN UP</Text>
            <TextInput
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              style={[styles.input, isDarkMode ? styles.darkTextInput : styles.lightTextInput]}
              placeholderTextColor={isDarkMode ? "#999" : "black"}
            />
            <TextInput
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              style={[styles.input, isDarkMode ? styles.darkTextInput : styles.lightTextInput]}
              placeholderTextColor={isDarkMode ? "#999" : "black"}
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={[styles.input, isDarkMode ? styles.darkTextInput : styles.lightTextInput]}
              placeholderTextColor={isDarkMode ? "#999" : "black"}
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              style={[styles.input, isDarkMode ? styles.darkTextInput : styles.lightTextInput]}
              secureTextEntry
              placeholderTextColor={isDarkMode ? "#999" : "black"}
            />
            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={[styles.input, isDarkMode ? styles.darkTextInput : styles.lightTextInput]}
              secureTextEntry
              placeholderTextColor={isDarkMode ? "#999" : "black"}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            
            <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={selectedOption}
              onValueChange={handleSelectChange}
              style={[styles.picker, isDarkMode ? styles.darkinput : styles.lightinput]}
            >
              <Picker.Item label="Admin" value="Admin" />
              <Picker.Item label="Employee" value="Employee" />
              <Picker.Item label="Driver" value="Driver" />
            </Picker>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <TouchableOpacity onPress={signUp} style={[styles.button, isDarkMode ? styles.darkbutton : styles.lightbutton]}>
                <Text style={[styles.buttonText, isDarkMode ? styles.darkbuttonText : styles.lightbuttonText]}>Sign Up</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  darkcontainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  lightcontainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerContainer: {
    position: 'absolute',
    top: 5,
    left: 65,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  togglebutton: {
    position: 'absolute',
    top: 57,
    left: 320,
  },
  logoImage: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  transparentContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
  },
  darkMode: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderColor: '#ccc',
  },
  lightMode: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: '#999',
  },
  signuptopic: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight:'bold',
  },
  lightText: {
    color: 'black',
  },
  darkText: {
    color: 'white',
  },
  input: {
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  lightTextInput: {
    color: 'black',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: '#999',
  },
  darkTextInput: {
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: '#ccc',
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  lightbutton: {
    backgroundColor: '#054AAB',
  },
  darkbutton: {
    backgroundColor: '#021E45',
  },
  buttonText: {
    fontSize: 18,
  },
  lightbuttonText: {
    color: 'white',
  },
  darkbuttonText: {
    color: 'white',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  dropdownContainer: {
    marginTop: 15,
    width: '100%',
  },
  picker: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
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
});
