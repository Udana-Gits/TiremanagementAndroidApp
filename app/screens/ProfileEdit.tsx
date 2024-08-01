import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';
import { getStorage, uploadBytes, getDownloadURL, ref as sRef } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const ProfileEdit: React.FC = () => {
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [personalEmail, setPersonalEmail] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const navigation = useNavigation();

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
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('./images/components/Arrow_left.png')} style={styles.backButtonImage} />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.profileContainer}>
        <View style={styles.profilePictureContainer}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
          ) : (
            <Image
              source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/tiremngdtbase.appspot.com/o/default.jpg?alt=media&token=be7f47f4-42ac-421b-a775-be76dd0de1bb' }}
              style={styles.profilePicture}
            />
          )}
          <TouchableOpacity onPress={selectImage} style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Upload Picture</Text>
          </TouchableOpacity>
          {uploading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Personal Email:</Text>
          <TextInput
            style={styles.input}
            value={personalEmail}
            onChangeText={setPersonalEmail}
          />
          <Text style={styles.label}>Date of Birth:</Text>
          <TextInput
            style={styles.input}
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="YYYY-MM-DD"
          />
          <Text style={styles.label}>Phone Number:</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <Text style={styles.label}>Address:</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
          />
          <Button title="Update Profile" onPress={handleUpdateProfile} color="#054AAB" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
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
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
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
