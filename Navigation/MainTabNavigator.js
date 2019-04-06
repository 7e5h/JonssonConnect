import React from 'react';
import { Platform} from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import { Icon } from 'native-base';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/Home';
import Jobs from '../screens/Jobs';
import EventDetails from '../screens/EventDetails';
import JobsDetails from '../screens/JobsDetails';
import ArticleDetails from '../screens/ArticleDetails';
import EventsCalendar from '../screens/EventsCalendar';
import Rewards from '../screens/Rewards';
import Help from '../screens/Help';
import Qrcode from '../screens/Qrcode';
import Redeem from '../screens/Redeem';
import Settings from '../screens/Settings';
import CodeDisplayScreen from '../screens/CodeDisplay';

const HomeFeedStack = createStackNavigator(
    {
    Home: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
      title: 'News Feed',
      headerLeft: <Icon type='FontAwesome'
         name='bars'
          style={{ fontSize: 34, color: '#ffffff', paddingLeft: 16 }}
          onPress={() => navigation.openDrawer()} />
        }),

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
          navigationOptions: ({ navigation }) => ({
              title: 'Jobs Feed',
              headerLeft: <Icon type='FontAwesome'
                name='bars'
                style={{ fontSize: 34, color: '#ffffff', paddingLeft: 16 }}
                onPress={() => navigation.openDrawer()} />
          }),
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
            navigationOptions: ({ navigation }) => ({
                title: 'News Feed',
                headerLeft: <Icon type='FontAwesome'
                    name='bars'
                    style={{ fontSize: 34, color: '#ffffff', paddingLeft: 16 }}
                    onPress={() => navigation.openDrawer()} />
            }),
        },
        EventDetails: {
            screen: EventDetails,
            navigationOptions: {
                title: 'Event Details',
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
    }
);

HomeFeedStack.navigationOptions = {
    tabBarLabel: 'HOME', 
    tabBarIcon: ({ focused }) => (
        <TabBarIcon 
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'}
        />
    ),
};

JobsFeedStack.navigationOptions = {
    tabBarLabel: 'JOBS', 
    tabBarIcon: ({ focused }) => (
        <TabBarIcon 
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-briefcase' : 'md-briefcase'}
        />
    ),
};

EventsFeedStack.navigationOptions = {
    tabBarLabel: 'EVENTS', 
    tabBarIcon: ({ focused }) => (
        <TabBarIcon 
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-calendar' : 'md-calendar'}
        />
    ),
};

export default TabNavigator = createBottomTabNavigator({
    HomeFeedStack,
    JobsFeedStack,
    EventsFeedStack,
},
    {
        tabBarOptions: {
            activeTintColor: '#FFFFFF',
            inactiveTintColor: '#D3D3D3', 
            labelStyle: {
                fontSize: 16,
            },
            screenstyle: {
                alignItems: 'center', 
                justifyContent: 'center', 
            },
            style: {
                backgroundColor: '#008542', // UTD Color
            },
            showIcon: true,
            showLabel: true
        },
    }); 
