import React from 'react';
import Expo from 'expo';
import {
    AsyncStorage,
    View,
    ActivityIndicator,
} from 'react-native';

const IS_LOGGED_IN_KEY = "isLoggedIn";

export default class AppLoading extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            fonts_loaded: false,
        };
    }

    async componentDidMount() {
        await this.loadFontsAndIcons();
        await this.checkUserLogin();
    }

    async loadFontsAndIcons() {
        // DISABLING DATA COLLECTION Ref: https://docs.expo.io/versions/latest/sdk/segment.html
        // Segment.setEnabledAsync(false);
        // This needs to happen here as the fonts only need to be loaded once,
        await Expo.Font.loadAsync({
          'Roboto': require('native-base/Fonts/Roboto.ttf'),
          'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
          'Ionicons': require('native-base/Fonts/Ionicons.ttf'),
          'Material Design Icons': require('native-base/Fonts/MaterialIcons.ttf'),
          'MaterialIcons': require('native-base/Fonts/MaterialIcons.ttf'),
          'Material Icons': require('native-base/Fonts/MaterialIcons.ttf'),
          'Material Community Icons': require('native-base/Fonts/MaterialCommunityIcons.ttf'),
          'MaterialCommunityIcons': require('native-base/Fonts/MaterialCommunityIcons.ttf'),
          'FontAwesome': require('native-base/Fonts/FontAwesome.ttf'),
          'Entypo': require('native-base/Fonts/FontAwesome.ttf'),
          'simple-line-icons': require('native-base/Fonts/SimpleLineIcons.ttf'),
          'SimpleLineIcons': require('native-base/Fonts/SimpleLineIcons.ttf'),
        });

        this.setState({ fonts_loaded: true });
    }

    async checkUserLogin() {

        // This will see if the login token already exists - If it does, go to Main App Screen. If not, go to Login Screen
        let loginToken = await AsyncStorage.getItem(IS_LOGGED_IN_KEY);

        if (loginToken == null) {
            this.props.navigation.navigate("Login");
        } else {
            this.props.navigation.navigate("DrawerNavigator");
        }
    }

    render() {
        return (
            <View></View>
        );
    }
}
