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
        <Text style={styles.footerText1}>Pavara Tire management System</Text>
      <Text style={styles.footerText}>
        {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    padding: 10,
    backgroundColor: '#054AAB',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: 'white',
  },
  footerText1: {
    fontSize: 20,
    color: 'white',
  },
});

export default Footer;
