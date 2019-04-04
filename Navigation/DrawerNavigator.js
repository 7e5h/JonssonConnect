import React from 'react';
import { Platform } from 'react-native';
import { createDrawerNavigator, createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation';

import AppScreenNavigator from './AppScreenNavigator';

import DrawerScreen from '../tabs/DrawerScreen';

export default DrawerNavigator = createDrawerNavigator(
    {
      AppScreenNavigator: AppScreenNavigator
    },
    {
      initialRouteName: 'AppScreenNavigator',
      contentComponent: DrawerScreen,
      drawerWidth: 250
    });