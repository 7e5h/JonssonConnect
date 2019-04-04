/**
 * JonssonConnect App Page
 * Developed in part by Manu, Akshay, Vignesh, Ramya, & Jahnavi
 */

import React from 'react';

import * as firebase from 'firebase';
import { 
  createAppContainer,
  createMaterialTopTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createDrawerNavigator 
} from "react-navigation";
import { FIREBASE_API_KEY } from './Keys';

import AppScreenNavigator from './Navigation/AppScreenNavigator';
import DrawerNavigator from './Navigation/DrawerNavigator';

import AppLoading from './tabs/AppLoading';
import HomeScreen from './tabs/Home';
import Jobs from './tabs/Jobs';
import Login from './tabs/Login';
import EventDetails from './tabs/EventDetails';
import JobsDetails from './tabs/JobsDetails';
import ArticleDetails from './tabs/ArticleDetails';
import EventsCalendar from './tabs/EventsCalendar';
import DrawerScreen from './tabs/DrawerScreen';
import Rewards from './tabs/Rewards';
import Help from './tabs/Help';
import Qrcode from './tabs/Qrcode';
import Redeem from './tabs/Redeem';
import Settings from './tabs/Settings';
import CodeDisplayScreen from './tabs/CodeDisplay';

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