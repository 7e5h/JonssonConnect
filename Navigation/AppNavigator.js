import { createSwitchNavigator } from 'react-navigation';

import DrawerNavigator from './DrawerNavigator';
import AppLoading from '../screens/AppLoading';
import Login from '../screens/Login';

export default AppNavigator = createSwitchNavigator ({
  AppLoading: AppLoading,
  Login: Login,
  DrawerNavigator: DrawerNavigator
});