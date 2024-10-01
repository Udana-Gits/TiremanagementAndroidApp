import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { useDarkMode } from './DarkModeContext';
import { translations } from './translations';

interface SettingsProps {}

const Settings: React.FC<SettingsProps> = () => {
  const [language, setLanguage] = useState<'en' | 'fr'>('en'); // default language is English
  const { isDarkMode } = useDarkMode();

  return (
    <ImageBackground>
      
      <Text style={[styles.title, isDarkMode ? styles.darkModeText : styles.lightModeText]}>
        {translations[language].settings}
      </Text>
      <View style={styles.languageToggleContainer}>
        <Text style={styles.languageToggleLabel}>
          Change language : 
        </Text>
        <TouchableOpacity onPress={() => setLanguage(language === 'en' ? 'fr' : 'en')}>
          <Text style={[styles.languageToggleText, isDarkMode ? styles.darkModeText : styles.lightModeText]}>
            {language === 'en' ? 'English' : 'Français'}
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
  },
  darkModeText: {
    color: '#fff',
  },
  lightModeText: {
    color: '#000',
  },
  languageToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
  },
  languageToggleLabel: {
    fontSize: 15,
    marginRight: 10,
  },
  languageToggleText: {
    fontSize: 16,
    color: '#ccc',
  },
});

export default Settings;