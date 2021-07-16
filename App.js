import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  Button,
  AppState,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// Import Screens
import SplashScreen from './Screen/SplashScreen';
import LoginScreen from './Screen/LoginScreen';
import ListUsers from './Screen/ListUsers';
import RegistrationScreen from './Screen/RegistrationScreen';
import DeregistrationScreen from './Screen/DeregistrationScreen';
import AppRegistrationScreen from './Screen/AppRegistrationScreen';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

function TabStack() {
  return (
    <Tab.Navigator
      initialRouteName="RegistrationScreen"
      tabBarOptions={{
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#F8F8F8',
        style: {
          backgroundColor: '#633689',
        },
        labelStyle: {
          textAlign: 'center',
        },
        indicatorStyle: {
          borderBottomColor: '#87B56A',
          borderBottomWidth: 2,
        },
      }}>
      <Tab.Screen
        name="RegistrationScreen"
        component={RegistrationScreen}
        options={{
          tabBarLabel: 'Registration',
        }}
      />
      <Tab.Screen
        name="DeregistrationScreen"
        component={DeregistrationScreen}
        options={{
          tabBarLabel: 'Deregistration',
        }}
      />
      <Tab.Screen
        name="ListUsers"
        component={ListUsers}
        options={{
          tabBarLabel: 'ListUsers',
        }}
      />
    </Tab.Navigator>
  );
}
const App = () => {
  useEffect(() => {
    console.log('----App.js-----');
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="TabStack"
          component={TabStack}
          options={{title: 'REGISTER/DEREGISTER'}}
        />

        <Stack.Screen
          name="AppRegistrationScreen"
          component={AppRegistrationScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
