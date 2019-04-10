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
import { WebBrowser, AuthSession } from 'expo'; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import { Icon, Text, Button, } from 'native-base';
import AppIntro from 'rn-app-intro-screen';

import LinkedInModal from 'react-native-linkedin'

const TUTORIAL_COMPLETED_KEY = "tutorialCompleted";
const IS_LOGGED_IN_KEY = "isLoggedIn";

const RCTNetworking = require("RCTNetworking");

export default class Login extends React.Component {

  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
  
    this.state = {
      isLoggedIn: false,
      access_token: undefined,
      expires_in: undefined,
      refreshing: false,
      tutorialCompleted: false,
    };
  }

  async componentDidMount() {
    this.checkIfUserHasCompletedTutorial();
  }

  async checkIfUserHasCompletedTutorial() {
    let hasCompletedTutorial = await AsyncStorage.getItem(TUTORIAL_COMPLETED_KEY);
    if (hasCompletedTutorial === 'true') {
      this.setState({ tutorialCompleted: true});
    } else {
      this.setState({ tutorialCompleted: false});
    }
  }

  completedTutorial = () => {
    AsyncStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
    this.setState({ tutorialCompleted: true });
    this.checkUserLogin(); 
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

  async checkUserLogin() {

    // This will see if the login token already exists - If it does, go to Main App Screen. If not, go to Login Screen
    let loginToken = await AsyncStorage.getItem(IS_LOGGED_IN_KEY);

    if (loginToken != null) {
      this.props.navigation.navigate("DrawerNavigator");
    }
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
    }

    await AsyncStorage.setItem('lastName', this.state.lastName);
    await AsyncStorage.setItem('firstName', this.state.firstName);
    await AsyncStorage.setItem('headline', this.state.headline);
    await AsyncStorage.setItem('userID', this.state.id);
    await AsyncStorage.setItem('location', JSON.stringify(this.state.location));
    await AsyncStorage.setItem('industry', this.state.industry);
    await AsyncStorage.setItem('email', this.state.emailAddress);
    await AsyncStorage.setItem(IS_LOGGED_IN_KEY, "loggedIn");
  }

  userLoggedInSuccessfully() {
    this.setState({ loggedInStatus: 'loggedIn' });
    this.props.navigation.navigate('DrawerNavigator');
  }

  ssoLogin = async () => {
    this.props.navigation.navigate('WebSSOLogin'); 
  }

  render() {

    const { emailAddress, refreshing } = this.state;

    // Show activity indicator until the tutorial is completed
    if (!this.state.tutorialCompleted) {
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
            <Text style={{ fontSize: RF(4), fontWeight: '800', color: "#C75B12" }}>Jonsson Connect</Text>
            <Text style={{ textAlign: 'center', fontSize: RF(2), paddingHorizontal: 20, fontWeight: "bold" }}>The Erik Jonsson School of Engineering & Computer Science</Text>
            <Text style={{ textAlign: 'center', fontSize: 16, paddingHorizontal: 20, color: "#008542", paddingVertical: 30 }}>
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

            <Text style={{ color: '#c75b12', fontSize: RF(2), marginBottom: 10  }}>Alumni Login</Text>
            <Button style={{backgroundColor: '#0077B5'}} onPress={() => this.modal.open()} full light >
              <Image source={require('../images/linkedin-logo.png')} style={{ width: 25, height: 25 }}></Image>
              <Text style={{ color: 'white', fontSize: RF(2), fontWeight: '600' }}>Sign in with LinkedIn</Text>
            </Button>

            <Text style={{color: '#c75b12', fontSize: RF(2), marginBottom: 10, marginTop: 20 }}>Student Login</Text>
            <Button style={{backgroundColor: '#c75b12'}} onPress={this.ssoLogin} full light >
              <Image source={require('../images/utd_logo.png')} style={{ width: 30, height: 30 }}></Image>
              <Text style={{ color: 'white', fontSize: RF(2), fontWeight: '600' }}>Sign in with UTD SSO</Text>
            </Button>

            <TouchableHighlight>
              <Button transparent onPress={() => { Linking.openURL('https://engineering.utdallas.edu') }} style={{ width: 400 }} full light>
                <Text style={{ color: '#c75b12', fontSize: RF(2)}}>Visit the Erik Jonsson School Website</Text>
              </Button>
            </TouchableHighlight>

            <TouchableHighlight style={{ marginVertical: 10 }}>
              <Button transparent onPress={() => { Linking.openURL('https://utdallas.edu/privacy/') }} style={{ width: 500 }} full light>
                <Text style={{ color: '#c75b12', fontSize: RF(2), fontWeight: "bold" }}>View Privacy Policy</Text>
              </Button>
            </TouchableHighlight>

          </View>

          <Text style={{ fontSize: 8, fontWeight: '100', position: "relative", paddingVertical: 20, textAlign: "center" }}>Copyright © 2018, The University of Texas at Dallas, all rights reserved.</Text>
        </View>
      </View>
    )
  }
}

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