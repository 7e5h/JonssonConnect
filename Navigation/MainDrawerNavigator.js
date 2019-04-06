import { createDrawerNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import DrawerScreen from '../screens/DrawerScreen';

export default MainAppDrawerNavigator = createDrawerNavigator(
    {
      MainTabNavigator: MainTabNavigator
    },
    {
      initialRouteName: 'MainTabNavigator',
      contentComponent: DrawerScreen,
      drawerWidth: 250
    });