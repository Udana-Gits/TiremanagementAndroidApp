import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useDarkMode } from './DarkModeContext';

const CustomCheckbox: React.FC = () => {
  const [checked, setChecked] = useState(false);
  const { isDarkMode } = useDarkMode();


  const toggleCheckbox = () => {
    setChecked(!checked);
  };

  return (
    <TouchableOpacity onPress={toggleCheckbox} style={styles.checkboxContainer}>
      <View
        style={[
          styles.checkbox,
          checked && styles.checkboxChecked,
          isDarkMode ? styles.checkboxDark : styles.checkboxLight
  ]}
>
        {checked && <Text  style={[styles.checkmark, isDarkMode ? styles.darkcheckmark : styles.lightcheckmark]}>✓</Text>}
      </View>
      <Text  style={[styles.checkboxLabel, isDarkMode ? styles.checkboxLabeldark : styles.checkboxLabellight]}>Remember Me</Text>
    </TouchableOpacity>
  );
};

export default CustomCheckbox;

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: '#333',
  },
  checkboxDark: {
    borderColor: '#ccc', // Border color in dark mode
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Background color in dark mode
  },
  checkboxLight: {
    borderColor: '#333', // Border color in light mode
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Background color in light mode
  },
  checkmark: {
    color: 'white',
    fontSize: 13,
  },
  darkcheckmark: {
    color: 'white',
  },
  lightcheckmark: {
    color: 'black',
  },
  checkboxLabel: {
    fontSize: 14,
  },
  checkboxLabeldark: {
    color: 'white',
  },
  checkboxLabellight: {
    color: 'black',
  },
});
