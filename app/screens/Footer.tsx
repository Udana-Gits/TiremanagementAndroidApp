import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerTime}>
        {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
      </Text>
      <Text style={styles.footerText}>Pavara Tire management System</Text>
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
  footerText: {
    fontSize: 20,
    color: 'white',
  },
});

export default Footer;
