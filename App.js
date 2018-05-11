/**
 * JonssonConnect Application
 * https://github.com/facebook/react-native
 * @flow
 */
 import React, { Component } from 'react';
 import { ActivityIndicator, AsyncStorage, Image, ListView, FlatList, StyleSheet, TouchableHighlight, View } from 'react-native';
 import { TabNavigator, StackNavigator } from "react-navigation";
 import { Container, Header, Content, Card, CardItem, Thumbnail, Icon, Text, Title, Button, Left, Body, Right, H1, H2, H3 } from 'native-base';
 //import ComputerScience from './tabs/ComputerScience'
 //import Profile from './tabs/Profile'
 import Home from './tabs/Home';
 import Jobs from './tabs/Jobs';
 import Events from './tabs/Events';
 import Login from './tabs/Login';
 import EventDetails from './tabs/EventDetails';
 import JobsDetails from './tabs/JobsDetails';
 import ArticleDetails from './tabs/ArticleDetails';
 import * as firebase from 'firebase';

 // Initialize Firebase
 export var config = {
   apiKey: "TODO",
   authDomain: "jonssonconnect.firebaseapp.com",
   databaseURL: "https://jonssonconnect.firebaseio.com",
   projectId: "jonssonconnect",
   storageBucket: "jonssonconnect.appspot.com",
 };

 export const firebaseApp = firebase.initializeApp(config);

 export const HomeFeedStack = StackNavigator({
   Home: {
     screen: Home,
     navigationOptions:({navigation}) => ({
      title: "News Feed",
      headerStyle: { paddingRight: 10, paddingLeft: 10, backgroundColor: '#ffffff', borderBottomWidth: 1},
      headerTitleStyle: { fontSize: 18, fontWeight: '100'},
    })
   },
   ArticleDetails: {screen: ArticleDetails},
 });

 export const EventsFeedStack = StackNavigator({
   EventsTab: {
     screen: Events,
     navigationOptions:({navigation}) => ({
      title: "Event Listings",
      headerStyle: { paddingRight: 10, paddingLeft: 10, backgroundColor: '#ffffff', borderBottomWidth: 1},
      headerTitleStyle: { fontSize: 18, fontWeight: '100' },
    })
   },
   EventDetails: {screen: EventDetails},
 });

 export const JobsFeedStack = StackNavigator({
   JobsTab: {
     screen: Jobs,
     navigationOptions:({navigation}) => ({
      title: "Job Listings",
      headerStyle: { paddingRight: 10, paddingLeft: 10, backgroundColor: '#ffffff', borderBottomWidth: 1},
      headerTitleStyle: { fontSize: 18, fontWeight: '100' },
    })
   },
   JobsDetails: {screen: JobsDetails},
 });

 export const AppScreenNavigator = TabNavigator({
   HomeFeedStack: {screen: HomeFeedStack},
   JobsTab: {screen: JobsFeedStack},
   EventsTab: {screen: EventsFeedStack},
  },
  {
   tabBarPosition: 'bottom',
   swipeEnabled: false,
   animationEnabled: false,
   tabBarOptions: {
     activeTintColor: '#3e9876',
     activeBackgroundColor: '#ffffff',
     inactiveBackgroundColor: '#ffffff',
     inactiveTintColor: '#B7C3D0',
   }
 });

 const AppNavigator = StackNavigator({
   Login:{screen: Login,
     navigationOptions:({navigation}) => ({
      header: null
    })},
   AppScreenNavigator:{screen: AppScreenNavigator,
    navigationOptions:({navigation}) => ({
      gesturesEnabled: false,
      header: null})
 }});

 AppScreenNavigator.navigationOptions = {
   title: "App"
 };

 export default AppNavigator
 //export default AppScreenNavigator
