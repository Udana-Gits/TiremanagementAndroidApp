import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/screens/Login';
import DriverHome from './app/screens/DriverHome';
import EmployeeHome from './app/screens/EmployeeHome';
import EnterData from './app/screens/EnterData';
import ViewData from './app/screens/ViewData';
import ViewVehicle from './app/screens/ViewVehicle';
import ProfileEdit from './app/screens/ProfileEdit';


type RootStackParamList = {
  Login: undefined;
  DriverHome: undefined;
  EmployeeHome: undefined;
  EnterData: undefined;
  ViewData: undefined;
  ViewVehicle: undefined;
  ProfileEdit: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
        <Stack.Screen options={{ headerShown: false }} name="DriverHome" component={DriverHome} />
        <Stack.Screen options={{ headerShown: false }} name="EmployeeHome" component={EmployeeHome} />
        <Stack.Screen options={{ headerShown: false }} name="EnterData" component={EnterData} />
        <Stack.Screen options={{ headerShown: false }} name="ViewData" component={ViewData} />
        <Stack.Screen options={{ headerShown: false }} name="ViewVehicle" component={ViewVehicle} />
        <Stack.Screen options={{ headerShown: false }} name="ProfileEdit" component={ProfileEdit} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
