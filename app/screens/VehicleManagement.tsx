import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';

const VehicleManagement = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Vehicle Management</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ViewVehicleData')}>
          <Image source={require('./images/truckdark.png')} style={styles.buttonImage} />
          <Text style={styles.buttonText}>View Vehicle Data</Text>
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

export default VehicleManagement;