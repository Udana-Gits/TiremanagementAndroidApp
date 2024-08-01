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
      source={require('./images/new.jpg')} // Replace with the path to your image
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Header />
        <Navbar authuser={authuser} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EnterData')}>
            <Text style={styles.buttonText}>Enter Tire Data</Text>
          </TouchableOpacity>
          <View style={styles.gap} />
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Slightly transparent background
  },
  backgroundImage: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#054AAB', // Button color
    paddingVertical: 15, // Vertical padding for height
    paddingHorizontal: 150, // Horizontal padding for width
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // Text color
    fontSize: 16, // Font size
  },
  gap: {
    height: 20,
  },
});

export default EmployeeHome;
