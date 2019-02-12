/**
 * JonssonConnect App Page
 * Developed in part by Manu, Akshay, Vignesh, Ramya, & Jahnavi
 */

import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, Image, ListView, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator, createStackNavigator, createSwitchNavigator, createDrawerNavigator } from "react-navigation";
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
import EventsCalendar from './tabs/EventsCalendar';
import DrawerScreen from './tabs/DrawerScreen';
import Rewards from './tabs/Rewards';
import Help from './tabs/Help';
import Agenda from './tabs/Agenda';
import Qrcode from './tabs/Qrcode';
import Redeem from './tabs/Redeem';
import CodeDisplay from './tabs/CodeDisplay';

import * as firebase from 'firebase';

console.disableYellowBox = true

// Initialize Firebase
export var config = {
  apiKey: "AIzaSyAt7rZyHL1GNFonaUquH0p4QyQFXi1lz6U",
  authDomain: "jonssonconnect.firebaseapp.com",
  databaseURL: "https://jonssonconnect.firebaseio.com",
  projectId: "jonssonconnect",
  storageBucket: "jonssonconnect.appspot.com",
};

export const firebaseApp = firebase.initializeApp(config);

export const HomeFeedStack = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: ({ navigation }) => ({
      title: "News Feed",
      headerStyle: { backgroundColor: '#C75B12', borderBottomWidth: 1 },
      headerTitleStyle: { fontSize: 18, fontWeight: '100', color: 'white' },
    })
  },

  ArticleDetails: {
    screen: ArticleDetails,
    navigationOptions: ({ navigation }) => ({
      title: "News Article",
      headerStyle: { backgroundColor: '#C75B12' },
      headerTitleStyle: { fontSize: 18, fontWeight: '100', color: 'white' },
    })
  },

  Rewards: {
    screen: Rewards,
    navigationOptions: ({ navigation }) => ({
      title: "Rewards",
      headerStyle: { backgroundColor: '#C75B12' },
      headerTitleStyle: { fontSize: 18, fontWeight: '100', color: 'white' },
    })
  },

  Redeem: {
    screen: Redeem,
    navigationOptions: ({ navigation }) => ({
      title: "Redeem Whoosh Bits",
      headerStyle: { backgroundColor: '#C75B12' },
      headerTitleStyle: { fontSize: 18, fontWeight: '100', color: 'white' },
    })
  },

  CodeDisplay: {
    screen: CodeDisplay,
    navigationOptions: ({ navigation }) => ({
      title: "QR Code",
      headerStyle: { backgroundColor: '#C75B12' },
      headerTitleStyle: { fontSize: 18, fontWeight: '100', color: 'white' },
    })
  },

  Help: {
    screen: Help,
    navigationOptions: ({ navigation }) => ({
      title: "Help & Feedback",
      headerStyle: { backgroundColor: '#C75B12', borderBottomWidth: 1 },
      headerTitleStyle: { fontSize: 18, fontWeight: '100', color: 'white' },
    })
  }
});

export const EventsFeedStack = createStackNavigator({
  EventsTab: {
    screen: EventsCalendar,
    navigationOptions: ({ navigation }) => ({
      title: "Events Calendar",
      headerStyle: { backgroundColor: '#C75B12', borderBottomWidth: 1 },
      headerTitleStyle: { fontSize: 18, fontWeight: '100', color: 'white' },
    })
  },
  EventDetails: { screen: EventDetails,
    navigationOptions: ({ navigation }) => ({
      title: "Event Details",
      headerStyle: { backgroundColor: '#C75B12', borderBottomWidth: 1 },
      headerTitleStyle: { fontSize: 18, fontWeight: '100', color: 'white' },
    })
  },
  EventsCalendar: { screen: EventsCalendar },
  Agenda: {
    screen: Agenda,
    navigationOptions: ({ navigation }) => ({
      title: "Events List",
      headerStyle: { backgroundColor: '#C75B12', borderBottomWidth: 1 },
      headerTitleStyle: { fontSize: 18, fontWeight: '100', color: 'white' },
    })
  },
  Qrcode: { screen: Qrcode,
    navigationOptions: ({ navigation }) => ({
      title: "Scan QR Code Here",
      headerStyle: { backgroundColor: '#C75B12', borderBottomWidth: 1 },
      headerTitleStyle: { fontSize: 18, fontWeight: '100', color: 'white' },
    })
  },
});

export const JobsFeedStack = createStackNavigator({
  JobsTab: {
    screen: Jobs,
    navigationOptions: ({ navigation }) => ({
      title: "Job Listings",
      headerStyle: { backgroundColor: '#C75B12', borderBottomWidth: 1 },
      headerTitleStyle: { fontSize: 18, fontWeight: '100', color: 'white' },
    })
  },
  JobsDetails: { screen: JobsDetails,
    navigationOptions: ({ navigation }) => ({
      title: "Job Details",
      headerStyle: { backgroundColor: '#C75B12', borderBottomWidth: 1 },
      headerTitleStyle: { fontSize: 18, fontWeight: '100', color: 'white' },
    })
  },
});

export const AppScreenNavigator = createMaterialTopTabNavigator({
  Home: { screen: HomeFeedStack },
  Jobs: { screen: JobsFeedStack },
  Events: { screen: EventsFeedStack },
},
  {
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#FFFFFF',
      labelStyle: {
        fontSize: 15,
      },
      style: {
        backgroundColor: '#008542', // UTD Color
      },
    }
  });

export const DrawerNavigator = createDrawerNavigator({
  AppScreenNavigator: {
    screen: AppScreenNavigator
  }
}, {
    //initialRouteName: 'HomeFeedStack',
    contentComponent: DrawerScreen,
    drawerWidth: 250
  });

const MenuImage = ({ navigation }) => {
  if (!navigation.state.isDrawerOpen) {
    return <Text>Not Open</Text>
  } else {
    return <Text>Drawer is Open</Text>
  }
}

// Main navigator for the app
export const AppNavigator = createSwitchNavigator({
  Login: {
    screen: Login,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  },
  DrawerNavigator: {
    screen: DrawerNavigator
  }
}, {
    navigationOptions: ({ navigation }) => ({
      title: 'ReactNavigation',  // Title to appear in status bar
      headerLeft:
        <TouchableOpacity onPress={() => { navigation.dispatch(DrawerActions.toggleDrawer()) }}>
          <MenuImage style="styles.bar" navigation={navigation} />
        </TouchableOpacity>,
      headerStyle: {
        backgroundColor: '#333',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },

    })
  });

AppScreenNavigator.navigationOptions = {
  title: "App"
};

export default AppNavigator
//export default AppScreenNavigator
