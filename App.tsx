//App.tsx
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/screens/Login';
import DriverHome from './app/screens/DriverHome';
import EmployeeHome from './app/screens/EmployeeHome';
import AdminHome from './app/screens/AdminHome';
import EnterData from './app/screens/EnterData';
import ViewData from './app/screens/ViewData';
import ViewVehicle from './app/screens/ViewVehicle';
import ProfileEdit from './app/screens/ProfileEdit';
import TireCheckList from './app/screens/TireCheckList';
import TireManagement from './app/screens/TireManagement';
import VehicleManagement from './app/screens/VehicleManagement';
import Administrative from './app/screens/Administrative';
import Settings from './app/screens/Settings';
import { DarkModeProvider } from './app/screens/DarkModeContext';



type RootStackParamList = {
  Login: undefined;
  DriverHome: undefined;
  EmployeeHome: undefined;
  AdminHome: undefined;
  TireManagement: undefined;
  VehicleManagement: undefined;
  Administrative: undefined;
  EnterData: undefined;
  ViewData: undefined;
  ViewVehicle: undefined;
  ProfileEdit: undefined;
  TireCheckList: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <DarkModeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
          <Stack.Screen options={{ headerShown: false }} name="DriverHome" component={DriverHome} />
          <Stack.Screen options={{ headerShown: false }} name="EmployeeHome" component={EmployeeHome} />
          <Stack.Screen options={{ headerShown: false }} name="AdminHome" component={AdminHome} />
          <Stack.Screen options={{ headerShown: false }} name="EnterData" component={EnterData} />
          <Stack.Screen options={{ headerShown: false }} name="ViewData" component={ViewData} />
          <Stack.Screen options={{ headerShown: false }} name="ViewVehicle" component={ViewVehicle} />
          <Stack.Screen options={{ headerShown: false }} name="ProfileEdit" component={ProfileEdit} />
          <Stack.Screen options={{ headerShown: false }} name="TireCheckList" component={TireCheckList} />
          <Stack.Screen options={{ headerShown: false }} name="TireManagement" component={TireManagement} />
          <Stack.Screen options={{ headerShown: false }} name="VehicleManagement" component={VehicleManagement} />
          <Stack.Screen options={{ headerShown: false }} name="Administrative" component={Administrative} />
          <Stack.Screen options={{ headerShown: false }} name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </DarkModeProvider>
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
