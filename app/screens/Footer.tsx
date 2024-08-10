import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDarkMode } from './DarkModeContext';


const Footer: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { isDarkMode, setIsDarkMode } = useDarkMode();


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.footerContainer}>
      <Text style={[styles.footerTime, isDarkMode ? styles.footerTimedark : styles.footerTimelight]}>
        {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
      </Text>
      <Text style={[styles.footerText, isDarkMode ? styles.footerTextdark : styles.footerTextlight]}>Pavara Tire management System</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    padding: 10,
    
    alignItems: 'center',
  },
  footerTime: {
    fontSize: 16,
    color: 'white',
  },
  footerTimedark: {
    color: 'white',
  },
  footerTimelight: {
    color: 'black',
  },
  footerText: {
    fontSize: 20,
    color: 'white',
  },
  footerTextdark: {
    color: 'white',
  },
  footerTextlight: {
    color: 'black',
  },
});

export default Footer;
