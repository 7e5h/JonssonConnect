import React, { Component } from 'react'
import {
  AsyncStorage,
  StyleSheet,
  Linking,
  View,
  Image,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import { Icon, Text, Button, } from 'native-base';
import AppIntro from 'rn-app-intro-screen';
import Expo from 'expo';

import LinkedInModal from 'react-native-linkedin'
const TUTORIAL_COMPLETED_KEY = "tutorialCompleted";
const IS_LOGGED_IN_KEY = "isLoggedIn";

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#ffffff',
  },
  responsiveBox: {
    width: wp('90%'),
    height: hp('90%'),
    // borderWidth: 2,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  backdrop: {
    height: 475,
    paddingTop: 60,
    width: null,
  },
  backdropView: {
    height: 230,
    width: 380,
    backgroundColor: 'rgba(0,0,0,0)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  userContainer: {
    padding: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  picture: {
    width: 200,
    height: 200,
    borderRadius: 100,
    resizeMode: 'cover',
    marginBottom: 15,
  },
  item: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  label: {
    marginRight: 10,
  },
  value: {
    fontWeight: 'bold',
    marginLeft: 10,
  },
  linkedInContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    flex: 0.7,
    alignItems: 'flex-end',
  },
  valueContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 200,
    width: 200
  },
  introTitleStyle: {

    color: "#C75B12",
    fontSize: 30,
    fontWeight: "bold",
  },
  introTextStyle: {
    textAlign: "center",
    fontSize: 20,
    color: "#C75B12",
  },
  slideImage: {
    width: 350,
    height: 501,
  }
});

const slides = [
  {
    key: 'Welcome',
    title: 'Hey There!',
    titleStyle: styles.introTitleStyle,
    text: "Here's a quick tutorial to get you started!",
    textStyle: styles.introTextStyle,
    image: require('../images/appicon.png'),
    imageStyle: styles.image,
  },
  {
    key: 'slide1',
    image: require('../assets/image1.png'),
  },
  {
    key: 'slide2',
    image: require('../assets/image2.png'),
  },
  {
    key: 'slide3',
    image: require('../assets/image3.png'),
  },
  {
    key: 'slide4',
    image: require('../assets/image4.png'),
  },
  {
    key: 'slide5',
    image: require('../assets/image5.png'),
  },
  {
    key: 'slide6',
    image: require('../assets/image6.png'),
  },
  {
    key: 'slide7',
    image: require('../assets/image7.png'),
  },
  {
    key: 'slide8',
    image: require('../assets/image8.png'),
  },
];

export default class Login extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoggedIn: false,
      access_token: undefined,
      expires_in: undefined,
      refreshing: false,
      fonts_loaded: false,
      tutorialCompleted: false,
    };
  }

  async componentDidMount() {
    await this.loadFontsAndIcons();
    this.checkIfUserHasCompletedTutorial();
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

  async checkIfUserHasCompletedTutorial() {
    let hasCompletedTutorial = await AsyncStorage.getItem(TUTORIAL_COMPLETED_KEY);
    if (hasCompletedTutorial === 'true') {
      this.setState({ tutorialCompleted: true});
      this.checkUserLogin()
    } else {
      this.setState({ tutorialCompleted: false});
    }
  }

  async checkUserLogin() {

    // This will see if the login token already exists - If it does, go to Main App Screen
    let loginToken = await AsyncStorage.getItem(IS_LOGGED_IN_KEY);

    if (loginToken != null) {
      // Login token found, continue to main app
      this.props.navigation.navigate("DrawerNavigator");
    }
  }

  completedTutorial = () => {
    AsyncStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
    this.setState({ tutorialCompleted: true });
    this.checkUserLogin()
  }

  /*
  *
  * Login Process (After authenticating with LinkedIn)
  *
  */
  async getUser({ access_token }) {

    this.setState({ refreshing: true })

    const baseApi = 'https://api.linkedin.com/v1/people/'
    const params = [
      'first-name',
      'last-name',
      'email-address',
      'summary',
      'picture-url',
      'id',
      'headline',
      'location:(name)',
      'picture-urls::(original)',
      'industry',
    ]

    const response = await fetch(`${baseApi}~:(${params.join(',')})?format=json`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
    })

    const payload = await response.json()

    await this.saveUserData(payload)
    this.userLoggedInSuccessfully()
  }

  async saveUserData(data) {

    this.setState({
      ...data,
      refreshing: false,
    })

    // Check if the user has a picture url from LinkedIn
    let picUrl = this.state.pictureUrl;

    if (picUrl != null) {
      await AsyncStorage.setItem('userPhoto', picUrl);
    } else {
      await AsyncStorage.setItem('userPhoto', 'https://www.utdallas.edu/brand/files/Temoc_Orange.png');
    }

    await AsyncStorage.setItem('lastName', this.state.lastName);
    await AsyncStorage.setItem('firstName', this.state.firstName);
    await AsyncStorage.setItem('headline', this.state.headline);
    await AsyncStorage.setItem('userID', this.state.id);
    await AsyncStorage.setItem('location', JSON.stringify(this.state.location));
    await AsyncStorage.setItem('industry', this.state.industry);
    await AsyncStorage.setItem(IS_LOGGED_IN_KEY, "loggedIn");
  }

  userLoggedInSuccessfully() {
    this.setState({ loggedInStatus: 'loggedIn' });
    this.props.navigation.navigate('DrawerNavigator');
  }

  render() {

    const { emailAddress, refreshing } = this.state;

    // Show activity indicator until fonts have been loaded, and the tutorial if not completed.
    if (!this.state.fonts_loaded) {
        return (
            <View style={{flex: 1, paddingTop: 20}}>
                <ActivityIndicator/>
            </View>
        );
    } else if (!this.state.tutorialCompleted) {
      return <AppIntro
        slides={slides}
        onDone={this.completedTutorial}
        bottomButton
      />;
    }

    // If no other special condition is true, render login screen
    return (
      <View style={styles.container}>
        <View style={styles.responsiveBox}>
            <View alignItems='center'>
              <Image source={require('../images/Temoc_Orange.png')} style={{ height: 150, width: 110 }}></Image>
              <Text style={{ fontSize: RF(4), fontWeight: '800', color: "#C75B12" }}>
                Jonsson Connect
            </Text>
              <Text style={{ textAlign: 'center', fontSize: RF(2), paddingHorizontal: 20, fontWeight: "bold" }}>
                {/* Begin exploring oppotunities only offered by the Jonsson School. */}
                The Erik Jonsson School of Engineering & Computer Science
            </Text>
              <Text style={{ textAlign: 'center', fontSize: 16, paddingHorizontal: 20, color: "#008542", paddingVertical: 30 }}>
                {/* Begin exploring oppotunities only offered by the Jonsson School. */}
                <Text style={{ fontSize: 22, color: "#008542", fontWeight: "bold" }}>
                  FEARLESS
              </Text>
                {" "}engineering
              <Text style={{ color: "#008542", fontSize: 8 }}>®</Text>
              </Text>
            </View>
          {!emailAddress &&
            !refreshing && (
              <View style={styles.linkedInContainer}>
                <LinkedInModal
                  ref={ref => {
                    this.modal = ref
                  }}
                  linkText=""
                  clientID="78ssigjikq1vry"
                  clientSecret="w994WmnW8KCgOVts"
                  redirectUri="https://engineering.utdallas.edu" // HAVE TO CHANGE
                  onSuccess={
                    data => this.getUser(data)
                  }
                />
              </View>
            )}
          <View style={styles.container}>
            <TouchableHighlight onPress={() => this.modal.open()}>
              <Button transparent onPress={() => this.modal.open()} style={{ width: 500 }} full light >
                <Image source={require('../images/linkedin-logo.png')} style={{ width: 25, height: 25 }}></Image>
                <Text style={{ color: '#c75b12', fontSize: RF(2) }}>
                  Sign in with LinkedIn
              </Text>
              </Button>
            </TouchableHighlight>
            <TouchableHighlight>
              <Button transparent onPress={() => { Linking.openURL('https://engineering.utdallas.edu') }} style={{ width: 400 }} full light>
                {/* <Image style={{ width: 25, height: 25 }} source={require('../images/Temoc_Secondary_Blue.png')}></Image> */}
                <Text style={{ color: '#c75b12', fontSize: RF(2) }}>
                  Visit the Erik Jonsson School Website
              </Text>
              </Button>
            </TouchableHighlight>
            <TouchableHighlight style={{ paddingVertical: 20 }}>
              <Button transparent onPress={() => { Linking.openURL('https://utdallas.edu/privacy/') }} style={{ width: 500 }} full light>
                <Image style={{ width: 25, height: 25 }}></Image>
                <Text style={{ color: '#c75b12', fontSize: RF(2), fontWeight: "bold" }}>
                  View Privacy Policy
              </Text>
              </Button>
            </TouchableHighlight>
          </View>
          <Text style={{ fontSize: 8, fontWeight: '100', position: "relative", paddingVertical: 20, textAlign: "center" }}>Copyright © 2018, The University of Texas at Dallas, all rights reserved.</Text>
        </View>
      </View>
    )
  }
}
