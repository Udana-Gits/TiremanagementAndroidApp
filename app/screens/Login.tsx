import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, View, TouchableOpacity, TextInput, ImageBackground, Image } from 'react-native';
import { auth } from '../../FirebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import CustomSwitch from './CustomSwitch';
import { useDarkMode } from './DarkModeContext';


type RootStackParamList = {
  DriverHome: undefined;
  EmployeeHome: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DriverHome'>;

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { isDarkMode, setIsDarkMode } = useDarkMode();

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      const userOccupation = await getUserOccupation(response.user.uid);
      if (userOccupation === 'Driver') {
        navigation.navigate('DriverHome');
      } else if (userOccupation === 'Employee') {
        navigation.navigate('EmployeeHome');
      }
    } catch (error) {
      console.error(error);
      alert('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        alert('Password reset email sent!');
      } catch (error) {
        console.error(error);
        alert('Error sending password reset email');
      }
    } else {
      alert('Please enter your email address');
    }
  };

  const getUserOccupation = async (uid: string) => {
    const db = getDatabase();
    const userRef = ref(db, `UserauthList/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      return userData.occupation;
    } else {
      console.error('User data not found.');
      return null;
    }
  };

  return (
    <ImageBackground
      source={require('./images/BG2.png')} // Replace with the path to your image
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView style={[styles.container, isDarkMode ? styles.darkcontainer : styles.lightcontainer]} behavior="padding">
        <View style={styles.headerContainer}>
          <Image
            source={isDarkMode ? require('./images/header.png') : require('./images/header1.png')} // Replace with the path to your image
            style={styles.logoImage}
          />
          <View style={styles.togglebutton}>
            <CustomSwitch value={isDarkMode} onValueChange={setIsDarkMode} />
          </View>
        </View>
        <View style={styles.mainContainer}>
          <View style={[styles.transparentContainer, isDarkMode ? styles.darkMode : styles.lightMode]}>
            <Text style={[styles.logintopic, isDarkMode ? styles.darkText : styles.lightText]}>LOGIN</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={[styles.input, isDarkMode ? styles.darkTextInput : styles.lightTextInput]}
                placeholderTextColor={isDarkMode ? "#999" : "black"}
              />
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  style={[styles.input, styles.passwordInput, isDarkMode ? styles.darkTextInput : styles.lightTextInput]}
                  secureTextEntry={!showPassword}
                  placeholderTextColor={isDarkMode ? "#999" : "black"}
                />
              </View>
              <View style={styles.buttoncontainer}>
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={[styles.showPasswordText, isDarkMode ? styles.darkText : styles.lightText]}>{showPassword ? 'Hide password' : 'Show password'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={[styles.forgotPasswordText, isDarkMode ? styles.darkText : styles.lightText]}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <TouchableOpacity onPress={signIn} style={[styles.button, isDarkMode ? styles.darkbutton : styles.lightbutton]}>
                  <Text style={[styles.buttonText, isDarkMode ? styles.darkbuttonText : styles.lightbuttonText]}>Log In</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Slightly transparent background
    borderColor: '#ccc',
  },
  darkcontainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Slightly transparent background
  },
  lightcontainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Slightly transparent background
  },
  headerContainer: {
    position: 'absolute',
    top: 5,
    left: 5,
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Slightly transparent container
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
  logintopic: {
    fontSize: 40,
    fontFamily: '',
  },
  lightText: {
    color: 'black',
  },
  darkText: {
    color: 'white',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 50,
  },
  input: {
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  passwordInput: {
    flex: 1,
  },
  buttoncontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  showPasswordText: {
    color: '#ccc',
    marginLeft: 10,
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#ccc',
    marginTop: 10,
    textAlign: 'right',
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  darkbutton: {
    backgroundColor: '#999',
  },
  lightbutton: {
    backgroundColor: 'black',
  },
  buttonText: {
    fontSize: 18,
  },
  darkbuttonText: {
    color: 'black',
  },
  lightbuttonText: {
    color: 'white',
  },
});
