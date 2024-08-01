import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Header from './Header'; // Adjust path as needed
import Footer from './Footer';
import Navbar from './NavBar'; // Adjust path as needed
import { auth, db } from '../../FirebaseConfig'; // Adjust path as needed
import { get, ref } from 'firebase/database';

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
    <ImageBackground source={require('./images/new.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Header />
        <Navbar authuser={authuser} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ViewVehicle')}>
            <Text style={styles.buttonText}>View Tire Data</Text>
          </TouchableOpacity>
        </View>
        <Footer />
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#054AAB',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default DriverHome;
