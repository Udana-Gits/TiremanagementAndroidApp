import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../FirebaseConfig'; 
import { get, ref } from 'firebase/database';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useDarkMode } from './DarkModeContext';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type AuthUser = {
  uid: string;
  profilePicture?: string;
  occupation?: string;
  firstName?: string;
};

type RootStackParamList = {
  Login: undefined;
  DriverHome: undefined;
  EmployeeHome: undefined;
  EnterData: undefined;
  ViewData: undefined;
  ProfileEdit: undefined;
};

type Props = {
  authuser: AuthUser | null;
};

const Navbar: React.FC<Props> = ({ authuser }) => {
  const [profilePicture, setProfilePicture] = useState('');
  const [occupation, setOccupation] = useState('');
  const [firstName, setFirstName] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (authuser) {
        const userRef = ref(db, `UserauthList/${authuser.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        if (userData) {
          setProfilePicture(userData.profilePicture);
          setOccupation(userData.occupation);
          setFirstName(userData.firstName);
        }
      }
    };

    fetchProfilePicture();
  }, [authuser]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  };

  const editProfile = () => {
    navigation.navigate('ProfileEdit');
  };

  return (
    <View style={[styles.navbar, isDarkMode ? styles.navbardark : styles.navbarlight]}>
      <View style={styles.container}>
        <View style={styles.navbarBrand}>
          <Text style={[styles.welcomeText, isDarkMode ? styles.welcomeTextdark : styles.welcomeTextlight]}>
            Welcome Back {firstName}!
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    padding: 10,
    position: 'relative',
    zIndex: 10,
    marginTop:-15
  },
  navbardark: {
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
  navbarlight: {
    backgroundColor: 'rgba(255, 255, 255, 0.0)',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navbarBrand: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign:'center',
  },

  welcomeTextdark: {
    color: 'white',
  },
  welcomeTextlight: {
    color: 'black',
  },
});

export default Navbar;
