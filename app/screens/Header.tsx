import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface HeaderProps {
  isDarkMode: boolean; // Added prop type for dark mode
}

const Header: React.FC<HeaderProps> = ({ isDarkMode }) => {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={isDarkMode ? require('./images/header.png') : require('./images/header.png')} // Replace with the path to your image
        style={styles.logoImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoImage: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
  },
});

export default Header;
