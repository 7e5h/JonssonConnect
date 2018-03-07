/**
 * JonssonConnect Application
 * https://github.com/facebook/react-native
 * @flow
 */
 import React, { Component } from 'react';
 import { Image, TextView, ListView } from 'react-native';
 import { TabNavigator, StackNavigator } from "react-navigation";
 import { Container, Header, Content, Card, CardItem, Icon, Thumbnail, Text, Title, Button, Left, Body, Right, H1, H2, H3 } from 'native-base';
 import Home from './tabs/Home'
 import Jobs from './tabs/Jobs'
 import Events from './tabs/Events'
 import Profile from './tabs/Profile'
 import EventDetails from './tabs/EventDetails'
 import JobsDetails from './tabs/JobsDetails'
 import ArticleDetails from './tabs/ArticleDetails'
 import Login from './tabs/Login'


 import * as firebase from 'firebase';

 // Initialize Firebase
 var config = {
   apiKey: "AIzaSyAt7rZyHL1GNFonaUquH0p4QyQFXi1lz6U",
   authDomain: "jonssonconnect.firebaseapp.com",
   databaseURL: "https://jonssonconnect.firebaseio.com",
   projectId: "jonssonconnect",
   storageBucket: "jonssonconnect.appspot.com",
 };
 const firebaseApp = firebase.initializeApp(config);

 export const HomeFeedStack = StackNavigator({
   Home: {
     screen: Home,
     navigationOptions:({navigation}) => ({
      title: "News Feed",
      headerStyle: { paddingRight: 10, paddingLeft: 10, backgroundColor: '#C75B12'}
    })
   },
   ArticleDetails: {screen: ArticleDetails},
 });

 export const FeedStack = StackNavigator({
   EventsTab: {
     screen: Events,
     navigationOptions:({navigation}) => ({
      title: "Events",
      headerStyle: { paddingRight: 10, paddingLeft: 10, backgroundColor: '#008542'}
    })
   },
   EventDetails: {screen: EventDetails},
 });

 export const JobsFeedStack = StackNavigator({
   JobsTab: {
     screen: Jobs,
     navigationOptions:({navigation}) => ({
      title: "Job Listings",
      headerStyle: { paddingRight: 10, paddingLeft: 10, backgroundColor: '#008542'}
    })
   },
   JobsDetails: {screen: JobsDetails},
 });

 export const AppScreenNavigator = TabNavigator({
   Home: {screen: HomeFeedStack},
   JobsTab: {screen: JobsFeedStack},
   EventsTab: {screen: FeedStack},
   ProfileTab: {screen: Profile},
 }, {
   tabBarPosition : 'bottom',
   tabBarOptions : {
     activeTintColor: '#104E8B',
     activeBackgroundColor: '#ffffff',
     inactiveBackgroundColor: '#ffffff',
     inactiveTintColor: '#B7C3D0',
     swipingEnbled: 'false',
   }
 });

 AppScreenNavigator.navigationOptions = {
   title: "App"
 };

 export default Login;
