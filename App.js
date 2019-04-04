/**
 * JonssonConnect App Page
 * Developed in part by Manu, Akshay, Vignesh, Ramya, & Jahnavi
 */

import React from 'react';
import * as firebase from 'firebase';
import { 
  createAppContainer,
  createSwitchNavigator,
} from "react-navigation";
import { FIREBASE_API_KEY } from './Keys';

import DrawerNavigator from './Navigation/DrawerNavigator';

import AppLoading from './tabs/AppLoading';
import Login from './tabs/Login';

import { StatusBar } from 'react-native';
StatusBar.setBarStyle("light-content")
StatusBar.setTranslucent(true)

console.disableYellowBox = true

// Initialize Firebase
export var config = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "jonssonconnect.firebaseapp.com",
  databaseURL: "https://jonssonconnect.firebaseio.com",
  projectId: "jonssonconnect",
  storageBucket: "jonssonconnect.appspot.com",
};

export const firebaseApp = firebase.initializeApp(config);


const AppNavigator = createSwitchNavigator ({
  AppLoading: AppLoading,
  Login: Login,
  DrawerNavigator: DrawerNavigator
});

export default App = createAppContainer(AppNavigator);