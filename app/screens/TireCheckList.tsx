import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../../FirebaseConfig'; // Adjust path as needed
import dayjs from 'dayjs';
import { useDarkMode } from './DarkModeContext';

interface Tire {
  id: string;
  tireNo: string;
  tirePosition: string;
  lastCheckedDate: string; // The date when the tire was last checked
}

const TireCheckList: React.FC = () => {
  const [tires, setTires] = useState<Tire[]>([]);
  const [checkedTires, setCheckedTires] = useState<Tire[]>([]);
  const [uncheckedTires, setUncheckedTires] = useState<Tire[]>([]);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const fetchTires = () => {
      const tireRef = ref(db, 'TireData/');
      onValue(tireRef, (snapshot) => {
        const data = snapshot.val();
        const tires: Tire[] = [];

        console.log("Raw Firebase Data:", data);

        // Iterate through each date in TireData
        for (const date in data) {
          const tireEntries = data[date];
          console.log(`Processing date: ${date}, tireEntries`);

          // Iterate through each tire under the specific date
          for (const tireId in tireEntries) {
            const tireData = tireEntries[tireId];
            console.log(`Processing tireId: ${tireId}, tireData`);

            const existingTire = tires.find(tire => tire.tireNo === tireData.tireNo);
            if (existingTire) {
              const lastCheckedDate = dayjs(date, 'MM-DD-YYYY');
              const existingLastCheckedDate = dayjs(existingTire.lastCheckedDate, 'MM-DD-YYYY');
              if (lastCheckedDate.isAfter(existingLastCheckedDate)) {
                existingTire.lastCheckedDate = date;
              }
            } else {
              tires.push({
                id: tireId,
                tireNo: tireData.tireNo,
                tirePosition: tireData.tirePosition,
                lastCheckedDate: date,
              });
            }
          }
        }

        console.log("Processed Tires:", tires);

        const today = dayjs().format('DD-MM-YYYY');
        const tiresDueForCheck = tires.filter(tire => {
          const lastChecked = dayjs(tire.lastCheckedDate, 'MM-DD-YYYY');
          return lastChecked.isBefore(today) || lastChecked.isSame(today);
        });

        const checkedTiresInit = tiresDueForCheck.filter(tire => dayjs(tire.lastCheckedDate, 'MM-DD-YYYY').isSame(today));
        const uncheckedTiresInit = tiresDueForCheck.filter(tire => !checkedTiresInit.includes(tire));

        setTires(tiresDueForCheck);
        setCheckedTires(checkedTiresInit);
        setUncheckedTires(uncheckedTiresInit);
      });
    };

    fetchTires();
  }, []);

  const handleCheckTire = (tire: Tire) => {
    const today = dayjs().format('MM-DD-YYYY');
    const tireRef = ref(db, `TireData/${today}/${tire.id}`);

    update(tireRef, {
      ...tire,
      lastCheckedDate: today,
    })
      .then(() => {
        setCheckedTires((prevTires) => [...prevTires, { ...tire, lastCheckedDate: today }]);
        setUncheckedTires((prevTires) => prevTires.filter((t) => t.id !== tire.id));
      })
      .catch((error) => {
        console.error("Error updating tire:", error);
      });
  };

  return (
    <ImageBackground
      source={require('./images/BG2.png')} // Adjust the path to your image
      style={styles.background}
    >
      <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
        <Text style={[styles.title, isDarkMode ? styles.darkModeText : styles.lightModeText]}>Tires to Check Today</Text>
        {uncheckedTires.length > 0 ? (
          <FlatList
            data={uncheckedTires}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleCheckTire(item)}
                style={[styles.tireContainer, isDarkMode ? styles.darkTireContainer : styles.lightTireContainer]}
              >
                <Text style={[styles.tireText, isDarkMode ? styles.darkModeText : styles.lightModeText]}>
                  {item.tireNo} - {checkedTires.some(t => t.id === item.id) ? 'Checked Today' : 'Not Checked Yet'}
                </Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={[styles.noTiresText, isDarkMode ? styles.darkModeText : styles.lightModeText]}>No tires need to be checked today.</Text>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  darkContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  lightContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  tireContainer: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  darkTireContainer: {
    backgroundColor: '#333',
  },
  lightTireContainer: {
    backgroundColor: '#f0f0f0',
  },
  tireText: {
    fontSize: 18,
    textAlign: 'center',
  },
  noTiresText: {
    fontSize: 18,
    textAlign: 'center',
  },
  darkModeText: {
    color: '#fff',
  },
  lightModeText: {
    color: '#000',
  },
});

export default TireCheckList;
