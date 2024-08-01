import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header: React.FC = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>OptiTrack</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 0,
    backgroundColor: '#054AAB',
    alignItems: 'center',
    
  },
  headerText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
    padding: 0,
    marginTop:20,
  },
});

export default Header;
