import { createSwitchNavigator } from 'react-navigation';

import AppLoading from '../screens/AppLoading';
import LoginStackNavigator from './LoginStackNavigator'; 
import MainDrawerNavigator from './MainDrawerNavigator';

export default MainAppSwitchNavigator = createSwitchNavigator ({
  AppLoading: AppLoading,
  Login: LoginStackNavigator,
  DrawerNavigator: MainDrawerNavigator
});