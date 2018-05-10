/**
 * JonssonConnect Application
 * https://github.com/facebook/react-native
 * @flow
 */
 import React, { Component } from 'react';
 import { ActivityIndicator, AsyncStorage, Image, ListView, FlatList, StyleSheet, TouchableHighlight, View } from 'react-native';
 import { TabNavigator, StackNavigator } from "react-navigation";
 import { Container, Header, Content, Card, CardItem, Thumbnail, Icon, Text, Title, Button, Left, Body, Right, H1, H2, H3 } from 'native-base';
 import ComputerScience from './tabs/ComputerScience'
 import Home from './tabs/Home'
 import Jobs from './tabs/Jobs'
 import Events from './tabs/Events'
 import Login from './tabs/Login'
 import Profile from './tabs/Profile'
 import EventDetails from './tabs/EventDetails'
 import JobsDetails from './tabs/JobsDetails'
 import ArticleDetails from './tabs/ArticleDetails'


 import * as firebase from 'firebase';

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

 export const FeedStack = StackNavigator({
   EventsTab: {
     screen: Events,
     navigationOptions:({navigation}) => ({
      title: "Events",
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
   //LoginFeedStack: {screen: LoginFeedStack},
   HomeFeedStack: {screen: HomeFeedStack},
   JobsTab: {screen: JobsFeedStack},
   EventsTab: {screen: FeedStack},
  }, {
   tabBarPosition : 'bottom',
   tabBarOptions : {
     activeTintColor: '#3e9876',
     activeBackgroundColor: '#ffffff',
     inactiveBackgroundColor: '#ffffff',
     inactiveTintColor: '#B7C3D0',
     swipingEnbled: 'true',
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
