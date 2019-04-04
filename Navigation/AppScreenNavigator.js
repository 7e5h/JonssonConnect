import React from 'react';
import { Platform} from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation';

import { Icon } from 'native-base';

import TabBarIcon from '../TabBarIcon';
import HomeScreen from '../tabs/Home';
import Jobs from '../tabs/Jobs';
import EventDetails from '../tabs/EventDetails';
import JobsDetails from '../tabs/JobsDetails';
import ArticleDetails from '../tabs/ArticleDetails';
import EventsCalendar from '../tabs/EventsCalendar';
import Rewards from '../tabs/Rewards';
import Help from '../tabs/Help';
import Qrcode from '../tabs/Qrcode';
import Redeem from '../tabs/Redeem';
import Settings from '../tabs/Settings';
import CodeDisplayScreen from '../tabs/CodeDisplay';

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

// export default AppScreenNavigator = createMaterialTopTabNavigator({
//   Home: { screen: HomeFeedStack },
//   Jobs: { screen: JobsFeedStack },
//   Events: { screen: EventsFeedStack },
// },
//     {
//       tabBarPosition: 'bottom',
//       swipeEnabled: false,
//       animationEnabled: true,
//       tabBarOptions: {
//         activeTintColor: '#FFFFFF',
//         labelStyle: {
//           fontSize: 15,
//         },
//         style: {
//           backgroundColor: '#008542', // UTD Color
//         },
//         tabStyle: {
//           padding: 8, margin:8,
//         },
//       }
//     }
//     );


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

export default createBottomTabNavigator({
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
                // flex: 1, 
                // justifyContent: 'center', 
                // alignItems: 'center', 
                // textAlign: 'center',
                // textAlignVertical: 'center',
            },
            tabStyle: {
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
