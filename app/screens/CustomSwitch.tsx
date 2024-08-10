import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ value, onValueChange }) => {
  // Animated value for smooth thumb movement
  const translateX = useRef(new Animated.Value(value ? 30 : 0)).current;

  // Effect to animate the thumb position when the value changes
  useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 30 : 0,
      useNativeDriver: true,
    }).start();
  }, [value]);

  return (
    <TouchableOpacity
      style={[styles.switch, value ? styles.switchOn : styles.switchOff]}
      onPress={() => onValueChange(!value)}
    >
      <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]}>
        <Image
          source={value ? require('./images/moon.png') : require('./images/sun.png')}
          style={styles.icon}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switch: {
    width: 60,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    padding: 2,
    borderWidth: 1.5,
  },
  switchOn: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background color when toggled on
    borderColor:'#ccc',
  },
  switchOff: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Background color when toggled off
    borderColor:'black',
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc', // Thumb background color
    position: 'absolute',
    top: 0.525,
  },
  icon: {
    width: 18,
    height: 18,
  },
});

export default CustomSwitch;
