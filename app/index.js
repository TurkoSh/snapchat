import React from 'react';
import { SafeAreaView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../src/screens/HomeScreen';
import SignUp from '../src/screens/SignUp';
import Login from '../src/screens/Login';
import MainPage from '../src/screens/MainPage';
import { AuthProvider } from '../src/authManager/AuthContext';
import UserScreen from '../src/screens/UserScreen';
import SnapScreen from '../src/screens/SnapScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Navigator screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
            height: 0,
            opacity: 0
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="MainPage" component={MainPage} />
          <Stack.Screen name="UserScreen" component={UserScreen} />
          <Stack.Screen name="SnapScreen" component={SnapScreen} />
          {/* <Stack.Screen name="Home" component={MainPage} /> */}
        </Stack.Navigator>
      </SafeAreaView>
    </AuthProvider>
  );
}

import { AppRegistry } from 'react-native';

AppRegistry.registerComponent('my_snapchat', () => App);
