import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Footer from './Footer';
import { useDarkMode } from './DarkModeContext';

type RootStackParamList = {
    Login: undefined;
    DriverHome: undefined;
    EmployeeHome: undefined;
    AdminHome: undefined;
    TireManagement: undefined;
    VehicleManagement: undefined;
    Administrative: undefined;
    EnterData: undefined;
    ViewData: undefined;
    ViewVehicle: undefined;
    ProfileEdit: undefined;
    TireCheckList: undefined;
  };


type Props = NativeStackScreenProps<RootStackParamList, 'TireManagement'>;

const TireManagement: React.FC<Props> = ({ navigation }) => {
    const { isDarkMode } = useDarkMode();

    return (
        <ImageBackground
            source={require('./images/BG2.png')} // Replace with the path to your image
            style={styles.backgroundImage}
        >
            <View style={[styles.container, isDarkMode ? styles.darkcontainer : styles.lightcontainer]} >
                <View style={styles.container}>
                <Text style={[styles.header, isDarkMode ? styles.darkModeText : styles.lightModeText]}>Tire Management</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, isDarkMode ? styles.darkbutton : styles.lightbutton]} onPress={() => navigation.navigate('EnterData')}>
                        <Image source={isDarkMode ? require('./images/enterdatadark.png') : require('./images/enterdatalight.png')} style={styles.buttonImage} />
                        <Text style={[styles.buttonText, isDarkMode ? styles.darkModeText : styles.lightModeText]}>Input Tire Data</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, isDarkMode ? styles.darkbutton : styles.lightbutton]} onPress={() => navigation.navigate('ViewData')}>
                        <Image source={isDarkMode ? require('./images/viewdatadark.png') : require('./images/viewdatalight.png')} style={styles.buttonImage} />
                        <Text style={[styles.buttonText, isDarkMode ? styles.darkModeText : styles.lightModeText]}>View Tire Data</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, isDarkMode ? styles.darkbutton : styles.lightbutton]} onPress={() => navigation.navigate('TireCheckList')}>
                        <Image source={isDarkMode ? require('./images/tododark.png') : require('./images/todolight.png')} style={styles.buttonImage} />
                        <Text style={[styles.buttonText, isDarkMode ? styles.darkModeText : styles.lightModeText]}> Tire Check List</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Footer />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
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
        zIndex: 6,
    },
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
        top:30,
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
    darkbutton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    lightbutton: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    darkModeText: {
        color: '#fff',
    },
    lightModeText: {
        color: 'black',
    }
});

export default TireManagement;