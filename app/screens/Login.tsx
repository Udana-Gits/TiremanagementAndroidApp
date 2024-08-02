import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, View, TouchableOpacity, TextInput, ImageBackground, Image } from 'react-native';
import { auth } from '../../FirebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Header from './Header'; // Adjust path as needed
import Footer from './Footer';

type RootStackParamList = {
  DriverHome: undefined;
  EmployeeHome: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DriverHome'>;

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();

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
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.imageContainer}>
          <Image
            source={require('./images/header.png')} // Replace with the path to your image
            style={styles.logoImage}
          />
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.transparentContainer}>
          <Text style={styles.logintopic}>LOGIN</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  style={[styles.input, styles.passwordInput]}
                  secureTextEntry={!showPassword}
                />
              </View>
              <View style={styles.buttoncontainer}>
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.showPasswordText}>{showPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <TouchableOpacity onPress={signIn} style={styles.button}>
                  <Text style={styles.buttonText}>Log In</Text>
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
    borderColor:'white',
  },
  imageContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  logoImage: {
    width: 200,
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
    borderColor: '#ccc',
    borderWidth: 1,
  },
  logintopic :{
    fontSize: 40,
    color:'white',
  },
  
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 50,
  },
  input: {
    backgroundColor: 'transparent',
    borderColor: '#ccc',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 5,
    color: '#ffff', // Change text color if needed
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    width: '100%',
  },
  passwordInput: {
    flex: 1,
  },

  buttoncontainer :{
  },
  showPasswordText: {
    color: '#ccc',
    marginLeft: 10,
    position:'relative',
    top:21,
    backgroundColor:'blue'
  },
  forgotPasswordText: {
    color: '#ccc',
    marginTop: 15,
    position:'relative',
    left:230,
    top:-10,
    
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // New button color
    width: '100%',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
