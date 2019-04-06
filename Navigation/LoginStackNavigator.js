import { createStackNavigator } from 'react-navigation';

import Login from '../screens/Login.js'; 
import WebSSOLogin from '../screens/WebSSOLogin.js';

export default LoginStackNavigator = createStackNavigator(
  {
    Login: Login,
    WebSSOLogin: WebSSOLogin,

  }, 
  {
    defaultNavigationOptions: {
      headerStyle: { backgroundColor: '#C75B12', borderBottomWidth: 1 },
      headerTintColor: '#ffffff',
      headerTitleStyle: { fontSize: 18, fontWeight: '100', color: 'white' },
    },
  }); 