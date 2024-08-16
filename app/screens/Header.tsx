import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../FirebaseConfig'; 
import { ref, get } from 'firebase/database';
import { useDarkMode } from './DarkModeContext';
import CustomSwitch from './CustomSwitch';

type AuthUser = {
  uid: string;
  profilePicture?: string;
  firstName?: string;
};

type RootStackParamList = {
  Login: undefined;
  ProfileEdit: undefined;
};

type Props = {
  authuser: AuthUser | null;
};

const Header: React.FC<Props> = ({ authuser }) => {
  const { isDarkMode, setIsDarkMode } = useDarkMode();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(-350))[0]; // Updated initial position to match new width
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (authuser) {
        const userRef = ref(db, `UserauthList/${authuser.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        if (userData) {
          setProfilePicture(userData.profilePicture);
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
        }
      }
    };

    fetchProfileData();
  }, [authuser]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    Animated.timing(slideAnim, {
      toValue: isOpen ? -350 : 0, // Slide in from -250 to 0 when opening
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseMenu = () => {
    if (isOpen) {
      setIsOpen(false);
      Animated.timing(slideAnim, {
        toValue: -350, // Slide out when closing
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
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
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={handleToggle} style={styles.toggleButton}>
        <Image
          source={isDarkMode ? require('./images/navicondark.png') : require('./images/naviconlight.png')}
          style={styles.toggleButtonImage}
        />
      </TouchableOpacity>
      <Image
        source={isDarkMode ? require('./images/header.png') : require('./images/header1.png')} // Use appropriate dark/light mode images
        style={styles.logoImage}
      />

      {/* Overlay for closing the menu when tapping outside */}
      {isOpen && (
        <TouchableWithoutFeedback onPress={handleCloseMenu}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View style={[styles.slideMenu, isDarkMode ? styles.slideMenudark : styles.slideMenulight, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.logoContainer}>
          <Image source={isDarkMode ? require('./images/header.png') : require('./images/header1.png')} style={styles.logoImage}/>
        </View>            
        <View style={styles.profileContainer}>
          {profilePicture && (            
            <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
          )}
          <Text style={[styles.userName, isDarkMode ? styles.userNamedark : styles.userNamelight]}>
            {firstName} {lastName}
          </Text>
        </View>
        <View style={styles.toggleContainer}>
          <View style={styles.toggleimage}>
            <Image source={isDarkMode ? require('./images/whitemoon.png') : require('./images/blacksun.png')} style={styles.toggleimage}/>
          </View>
          <View style={styles.toggletext}>
            <Text style={[styles.menuButtonText, isDarkMode ? styles.menuButtonTextdark : styles.menuButtonTextlight]}>
              Display Mode   
            </Text>
          </View>
          <CustomSwitch value={isDarkMode} onValueChange={setIsDarkMode} />
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={editProfile}>
          <Image source={isDarkMode ? require('./images/editprofiledark.png') : require('./images/editprofilelight.png')} style={styles.toggleimage}/>
          <Text style={[styles.menuButtonText, isDarkMode ? styles.menuButtonTextdark : styles.menuButtonTextlight]}>
            Edit Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={handleSignOut}>
          <Image source={isDarkMode ? require('./images/signoutdark.png') : require('./images/signoutlight.png')} style={styles.toggleimage}/>
          <Text style={[styles.menuButtonText, isDarkMode ? styles.menuButtonTextdark : styles.menuButtonTextlight]}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    zIndex: 10,
  },
  toggleButton: {
    marginRight: 10,
  },
  toggleimage:{
    marginRight: 10,
    width:20,
    height:20,
  },
  toggleButtonImage: {
    width: 30,
    height: 30,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'transparent',
    zIndex: 5,
  },
  slideMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: Dimensions.get('window').height,
    width: 350,
    borderRadius: 9,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 10,
  },
  slideMenudark: {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  slideMenulight: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  profileContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 90,
    marginBottom: 10,
  },
  userName: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingTop:20,
  },
  userNamedark: {
    color: 'white',
  },
  userNamelight: {
    color: 'black',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Space between toggle and next menu button
    paddingTop:30,

  },
  toggletext:{
    marginRight: 90,
  },
  menuButton: {
    paddingVertical: 15,
    flexDirection:'row'
  },
  menuButtonText: {
    fontSize: 20,
  },
  menuButtonTextdark: {
    color: 'white',
  },
  menuButtonTextlight: {
    color: 'black',
  },
});

export default Header;
