import { createDrawerNavigator } from 'react-navigation';

import AppScreenNavigator from './AppScreenNavigator';
import DrawerScreen from '../screens/DrawerScreen';

export default DrawerNavigator = createDrawerNavigator(
    {
      AppScreenNavigator: AppScreenNavigator
    },
    {
      initialRouteName: 'AppScreenNavigator',
      contentComponent: DrawerScreen,
      drawerWidth: 250
    });