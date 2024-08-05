import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Header from './Header'; // Adjust path as needed
import Footer from './Footer';
import Navbar from './NavBar';
import { auth, db } from '../../FirebaseConfig'; // Adjust path as needed
import { get, ref } from 'firebase/database';

type RootStackParamList = {
  Login: undefined;
  DriverHome: undefined;
  EmployeeHome: undefined;
  EnterData: undefined;
  ViewData: undefined;
};

type AuthUser = {
  uid: string;
  profilePicture?: string;
  occupation?: string;
  firstName?: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'EmployeeHome'>;

const EmployeeHome: React.FC<Props> = ({ navigation }) => {
  const [authuser, setAuthUser] = useState<AuthUser | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const fetchAuthUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = ref(db, `UserauthList/${user.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        if (userData) {
          setAuthUser({
            uid: user.uid,
            profilePicture: userData.profilePicture,
            occupation: userData.occupation,
            firstName: userData.firstName,
          });
        }
      }
    };

    fetchAuthUser();
  }, []);

  return (
    <ImageBackground
      source={require('./images/BG2.png')} // Replace with the path to your image
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Header isDarkMode={isDarkMode} />
        <View style={styles.mainContent}>
          <Navbar authuser={authuser} />
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EnterData')}>
              <Text style={styles.buttonText}>Enter Tire Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ViewData')}>
              <Text style={styles.buttonText}>View Tire Data</Text>
            </TouchableOpacity>
          </View>
        <Footer />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slightly transparent background
  },
  backgroundImage: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center', // Center content vertically within the available space
    display:'flex',
    top:-250,
  },
  buttonContainer: {
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'center', // Center buttons horizontally
    alignItems: 'center', // Align items in the center of the row
    display:'flex'
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Button color
    paddingVertical: 15, 
    paddingHorizontal: 30, 
    borderRadius: 5,
    height: 90,
    width: 90,
    alignItems: 'center',
    marginHorizontal: 10, // Space between buttons
  },
  buttonText: {
    color: '#fff', // Text color
    fontSize: 16, // Font size
  },
});

export default EmployeeHome;
