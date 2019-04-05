/**
 * JonssonConnect App Page
 * Developed in part by Manu, Akshay, Vignesh, Ramya, & Jahnavi
 */

import { createAppContainer } from "react-navigation";

import * as firebase from 'firebase';
import { FIREBASE_API_KEY } from './Keys';

import AppNavigator from './navigation/AppNavigator.js';
console.disableYellowBox = true

//
// Initialize Firebase
//
export var config = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "jonssonconnect.firebaseapp.com",
  databaseURL: "https://jonssonconnect.firebaseio.com",
  projectId: "jonssonconnect",
  storageBucket: "jonssonconnect.appspot.com",
};
export const firebaseApp = firebase.initializeApp(config);

//
//  Export App
//
export default App = createAppContainer(AppNavigator);