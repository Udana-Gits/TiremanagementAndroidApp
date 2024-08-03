import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../FirebaseConfig'; 
import { get, ref } from 'firebase/database';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
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
  const [isOpen, setIsOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [occupation, setOccupation] = useState('');
  const [firstName, setFirstName] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

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
    <View style={styles.navbar}>
      <View style={styles.container}>
        <View style={styles.navbarBrand}>
          <Text style={styles.welcomeText}>Welcome {firstName}</Text>
        </View>
        <TouchableOpacity onPress={handleToggle}>
          {profilePicture ? (
            <Image
              source={{ uri: profilePicture }}
              style={styles.profilePicture}
            />
          ) : (
            <Image
              source={{ uri: '/images/components/threelinebutton.png' }}
              style={styles.toggleButtonImage}
            />
          )}
        </TouchableOpacity>
        {isOpen && (
            
          <View style={styles.navbarProfilePopup}>
            {profilePicture ? (
            <Image
              source={{ uri: profilePicture }}
              style={styles.profilePicture1}
            />
          ) : (
            <Image
              source={{ uri: '/images/components/threelinebutton.png' }}
              style={styles.toggleButtonImage}
            />
          )}
            <View style={styles.profileActions}>
              {authuser ? (
                <View>
                  <TouchableOpacity onPress={editProfile} style={styles.navbarButton}>
                    <Text style={styles.navbarButtonText}>Edit Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSignOut} style={styles.navbarButton}>
                    <Text style={styles.navbarButtonText}>Sign Out</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.signedOutText}>Signed out</Text>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 10,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profilePicture1: {
    width: 100,
    height: 100,
    borderRadius: 90,
    marginTop: 30,
  },
  toggleButtonImage: {
    width: 30,
    height: 30,
  },
  navbarProfilePopup: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 9,
    padding: 10,
    shadowColor: '#fff',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    alignItems: 'center',
    height: 500,
    width:250,
  },
  profileActions: {
    alignItems: 'center',
  },
  navbarButton: {
    backgroundColor: '#054AAB', // Change button color
    padding: 15, // Adjust padding for button size
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
    width: 190, // Adjust button width
  },
  navbarButtonText: {
    color: '#fff',
    fontSize: 16,
    alignContent:'flex-end'
  },
  signedOutText: {
    fontSize: 14,
    color: '#888',
  },
});

export default Navbar;
