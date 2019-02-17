/**
 * JonssonConnect App Page
 * Developed in part by Manu, Akshay, Vignesh, Ramya, & Jahnavi
 */

import React from 'react';
import { createAppContainer, createMaterialTopTabNavigator, createStackNavigator, createSwitchNavigator, createDrawerNavigator } from "react-navigation";

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
import Agenda from './tabs/Agenda';
import Qrcode from './tabs/Qrcode';
import Redeem from './tabs/Redeem';
import Settings from './tabs/Settings';
import CodeDisplayScreen from './tabs/CodeDisplay';

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

const HomeFeedStack = createStackNavigator(
    {
      Home: {
        screen: HomeScreen,
        navigationOptions: {
          title: 'News Feed',
        }
      },
      ArticleDetails: {
        screen: ArticleDetails,
        navigationOptions: {
          title: 'News Article',
        }
      },
      Rewards: {
        screen: Rewards,
        navigationOptions: {
          title: 'Rewards',
        }
      },
      Redeem: {
        screen: Redeem,
        navigationOptions: {
          title: 'Redeem',
        }
      },
      CodeDisplay: {
        screen: CodeDisplayScreen,
        navigationOptions: {
          title: 'QR Code',
        }
      },
      Help: {
        screen: Help,
        navigationOptions: {
          title: 'Help',
        }
      },
      Settings: {
        screen: Settings,
        navigationOptions: {
          title: 'Settings'
        }
      },
    },
    {
      initialRouteName: 'Home',
      defaultNavigationOptions: {
        headerStyle: { backgroundColor: '#C75B12', borderBottomWidth: 1 },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontSize: 18, fontWeight: '100', color: 'white' },
      },
    });

const JobsFeedStack = createStackNavigator(
    {
      Jobs: {
        screen: Jobs,
        navigationOptions: {
          title: 'Job Listings',
        }
      },
      JobsDetails: {
        screen: JobsDetails,
        navigationOptions: {
          title: 'Job Details',
        }
      },
    },
    {
      initialRouteName: 'Jobs',
      defaultNavigationOptions: {
        headerStyle: { backgroundColor: '#C75B12', borderBottomWidth: 1 },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontSize: 18, fontWeight: '100', color: 'white' },
    },
    });

const EventsFeedStack = createStackNavigator(
    {
      EventsCalendar: {
        screen: EventsCalendar,
        navigationOptions: {
          title: 'Events Calendar',
        }
      },
      EventDetails: {
        screen: EventDetails,
        navigationOptions: {
          title: 'Event Details',
        }
      },
      Agenda: {
        screen: Agenda,
        navigationOptions: {
          title: 'Event List',
        }
      },
      Qrcode: {
        screen: Qrcode,
        navigationOptions: {
          title: 'Scan QR Code Here',
        }
      },
    },
    {
      initialRouteName: 'EventsCalendar',
      defaultNavigationOptions: {
        headerStyle: { backgroundColor: '#C75B12', borderBottomWidth: 1 },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontSize: 18, fontWeight: '100', color: 'white' },
      },
    });

const AppScreenNavigator = createMaterialTopTabNavigator({
  Home: { screen: HomeFeedStack },
  Jobs: { screen: JobsFeedStack },
  Events: { screen: EventsFeedStack },
},
    {
      tabBarPosition: 'bottom',
      swipeEnabled: false,
      animationEnabled: true,
      tabBarOptions: {
        activeTintColor: '#FFFFFF',
        labelStyle: {
          fontSize: 15,
        },
        style: {
          backgroundColor: '#008542', // UTD Color
        },
        tabStyle: {
          padding: 10, margin:10,
        },
      }
    }
    );

const DrawerNavigator = createDrawerNavigator(
    {
      AppScreenNavigator: AppScreenNavigator
    },
    {
      initialRouteName: 'AppScreenNavigator',
      contentComponent: DrawerScreen,
      drawerWidth: 250
    });

const AppNavigator = createSwitchNavigator ({
  Login: Login,
  DrawerNavigator: DrawerNavigator
});

export default App = createAppContainer(AppNavigator);
