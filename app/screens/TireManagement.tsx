import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import Header from './Header';
import Footer from './Footer';
import Navbar from './NavBar';

const TireManagement = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tire Management</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('InputTireData')}>
          <Image source={require('./images/truckdark.png')} style={styles.buttonImage} />
          <Text style={styles.buttonText}>Input Tire Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ViewTireData')}>
          <Image source={require('./images/truckdark.png')} style={styles.buttonImage} />
          <Text style={styles.buttonText}>View Tire Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TirePerformance')}>
          <Image source={require('./images/truckdark.png')} style={styles.buttonImage} />
          <Text style={styles.buttonText}>Tire Performance</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 9,
    height: 160,
    width: 350,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  buttonImage: {
    width: 70,
    height: 70,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default TireManagement;