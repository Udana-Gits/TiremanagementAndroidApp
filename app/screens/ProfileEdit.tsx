import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';
import { getStorage, uploadBytes, getDownloadURL, ref as sRef } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useDarkMode } from './DarkModeContext';


const ProfileEdit: React.FC = () => {
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [personalEmail, setPersonalEmail] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const navigation = useNavigation();
  const { isDarkMode } = useDarkMode();


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        setUser(userAuth);

        const db = getDatabase();
        const userRef = ref(db, `UserauthList/${userAuth.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();

        if (userData) {
          setDateOfBirth(userData.dateOfBirth || '');
          setPhoneNumber(userData.phoneNumber || '');
          setAddress(userData.address || '');
          setProfilePicture(userData.profilePicture || '');
          setPersonalEmail(userData.personalEmail || '');
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = async () => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    const db = getDatabase();
    const userRef = ref(db, `UserauthList/${user.uid}`);
    const snapshot = await get(userRef);
    const existingUserData = snapshot.val();

    if (!existingUserData) {
      console.error("User data not found in database");
      return;
    }

    const updatedUserData = {
      ...existingUserData,
      phoneNumber: phoneNumber || existingUserData.phoneNumber,
      address: address || existingUserData.address,
      dateOfBirth: dateOfBirth || existingUserData.dateOfBirth,
      profilePicture: profilePicture || existingUserData.profilePicture,
      personalEmail: personalEmail || existingUserData.personalEmail,
    };

    try {
      await set(userRef, updatedUserData);
      console.log("Profile updated successfully");
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleImageChange = async (imageUri: string) => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }
    try {
      setUploading(true);
      const storage = getStorage();
      const storageRef = sRef(storage, `profilePictures/${user.uid}`);
      const response = await fetch(imageUri);
      const blob = await response.blob();
      console.log("Uploading image to Firebase Storage...");
      await uploadBytes(storageRef, blob);
      console.log("Image uploaded successfully");

      const downloadURL = await getDownloadURL(storageRef);
      console.log("Download URL:", downloadURL);
      setProfilePicture(downloadURL);

      const db = getDatabase();
      const userRef = ref(db, `UserauthList/${user.uid}`);
      const snapshot = await get(userRef);
      const existingUserData = snapshot.val();

      if (!existingUserData) {
        console.error("User data not found in database");
        return;
      }

      await set(userRef, { ...existingUserData, profilePicture: downloadURL });
      console.log("Profile picture updated successfully in database");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    } finally {
      setUploading(false);
    }
  };

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleImageChange(result.assets[0].uri);
    }
  };

  return (
    <ImageBackground source={require('./images/BG2.png')} style={styles.backgroundImage}>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profilePictureContainer}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
          ) : (
            <Image
              style={styles.profilePicture}
            />
          )}
          <TouchableOpacity onPress={selectImage} style={[styles.uploadButton, isDarkMode ? styles.darkuploadButton : styles.lightuploadButton]}>
            <Text style={[styles.uploadButtonText, isDarkMode ? styles.darkuploadButtonText : styles.lightuploadButtonText]}>Upload Picture</Text>
          </TouchableOpacity>
          {uploading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
        <View style={styles.form}>
          <Text  style={[styles.label, isDarkMode ? styles.darklabel : styles.lightlabel]}>Personal Email:</Text>
          <TextInput
            style={styles.input}
            value={personalEmail}
            onChangeText={setPersonalEmail}
          />
          <Text style={[styles.label, isDarkMode ? styles.darklabel : styles.lightlabel]}>Date of Birth:</Text>
          <TextInput
            style={styles.input}
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="YYYY-MM-DD"
          />
          <Text style={[styles.label, isDarkMode ? styles.darklabel : styles.lightlabel]}>Phone Number:</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <Text style={[styles.label, isDarkMode ? styles.darklabel : styles.lightlabel]}>Address:</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
          />
          <TouchableOpacity onPress={handleUpdateProfile} style={[styles.uploadButton, isDarkMode ? styles.darkuploadButton : styles.lightuploadButton]}>
            <Text style={[styles.uploadButtonText, isDarkMode ? styles.darkuploadButtonText : styles.lightuploadButtonText]}>Update Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    </ImageBackground>

  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slightly transparent background
  },
  backgroundImage: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonImage: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#054AAB',
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#054AAB',
    padding: 10,
    borderRadius: 5,
  },
  darkuploadButton:{
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  lightuploadButton:{
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  uploadButtonText: {
    fontSize: 16,
    alignSelf:'center',
  },
  darkuploadButtonText: {
    color: '#fff',
  },
  lightuploadButtonText: {
    color: 'black',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  darklabel: {
    color: '#fff',
  },
  lightlabel: {
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
});

export default ProfileEdit;
