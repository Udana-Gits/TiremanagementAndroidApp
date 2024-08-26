//DriverHome
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Header from './Header'; // Adjust path as needed
import Footer from './Footer';
import Navbar from './NavBar'; // Adjust path as needed
import { auth, db } from '../../FirebaseConfig'; // Adjust path as needed
import { get, ref } from 'firebase/database';
import { useDarkMode } from './DarkModeContext';



type RootStackParamList = {
  Login: undefined;
  DriverHome: undefined;
  EmployeeHome: undefined;
  EnterData: undefined;
  ViewData: undefined;
  ViewVehicle: undefined;
};

type AuthUser = {
  uid: string;
  profilePicture?: string;
  occupation?: string;
  firstName?: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'DriverHome'>;

const DriverHome: React.FC<Props> = ({ navigation }) => {
const [authuser, setAuthUser] = useState<AuthUser | null>(null);
const { isDarkMode } = useDarkMode();


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
    <ImageBackground source={require('./images/BG2.png')} style={styles.backgroundImage}>
      <View style={[styles.container, isDarkMode ? styles.darkcontainer : styles.lightcontainer]}>
        <Header authuser={authuser}/>
        <View style={styles.navbar}>
          <Navbar authuser={authuser} />
        </View>
          <View style={styles.mainContent}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, isDarkMode ? styles.darkbutton : styles.lightbutton] } onPress={() => navigation.navigate('ViewVehicle')}>
                <Image source={isDarkMode ? require('./images/truckdark.png') : require('./images/trucklight.png') } style={styles.buttonImage2} />
                <Text style={[styles.buttonText, isDarkMode ? styles.darkModeText : styles.lightModeText]}>View vehicle Data</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, isDarkMode ? styles.darkbutton : styles.lightbutton] } onPress={() => navigation.navigate('ViewData')}>
                <Image source={isDarkMode ? require('./images/viewdatadark.png') : require('./images/viewdatalight.png') } style={styles.buttonImage} />
                <Text style={[styles.buttonText, isDarkMode ? styles.darkModeText : styles.lightModeText]}>View Tire Data</Text>
              </TouchableOpacity>
            </View>
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
  darkcontainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Slightly transparent background
  },
  lightcontainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Slightly transparent background
  },
  backgroundImage: {
    flex: 1,
  },
  navbar: {
    display: 'flex',
    top: -30,
    zIndex:6,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center', // Center content vertically within the available space
    alignItems: 'center',
    top: -50, // Center content horizontally within the available space
  },
  buttonContainer: {
    flexDirection: 'column', // Arrange buttons in a row
    justifyContent: 'center', // Center buttons horizontally
    alignItems: 'center', // Align items in the center of the row
    top: 40,
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Button color
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 9,
    height: 200,
    width: 350, // Increased width for better appearance
    alignItems: 'center',
    justifyContent: 'center', // Center text inside the button
    marginHorizontal: 10, // Space between buttons
    marginVertical: 10, // Space between buttons
  },
  darkbutton:{
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  lightbutton:{
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  buttonImage: {
    width: 70,
    height: 70,
    marginBottom: 20, // Space between the image and the text
  },
  buttonImage2: {
    width: 90,
    height: 70,
    marginBottom: 20, // Space between the image and the text
  },
  buttonText: {
    fontSize: 16, // Font size
    textAlign: 'center', // Center text inside the button
  },
  darkModeText:{
    color: '#fff',
  },
  lightModeText:{
    color: 'black',
  }
});

export default DriverHome;
