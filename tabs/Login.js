import React, { Component } from 'react'
import {
  AsyncStorage,
  StyleSheet,
  Linking,
  View,
  Dimensions,
  Clipboard,
  Image,
  ImageBackground,
  ActivityIndicator,
  StatusBar,
  TouchableHighlight,
} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import RF from 'react-native-responsive-fontsize';
import { Container, Header, Content, Card, CardItem, Thumbnail, List, ListItem, Icon, Item, Input, Tab, Tabs, Text, Title, Button, Left, Body, Right, H1, H2, H3, } from 'native-base';
import { Segment } from 'expo';
import AppIntro from 'rn-app-intro-screen';

//import { CLIENT_ID, CLIENT_SECRET } from './config'

import LinkedInModal from 'react-native-linkedin'

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
  // activeDot: {
  //   color: "#C75B12"
  // },
  // allDotStyle: {
  //   color: "blue"
  // },
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
    key: 'Login',
    // text: "Make sure you've got your LinkedIn Creds with you!",
    image: require('../assets/image1.png'),
    // imageStyle: styles.image,
    // backgroundColor: '#C75B12',
  },
  {
    key: 'Home',
    // title: 'Home Sweet Home!',
    // text: "Check the latest news here!\nPro Tip: Double tap on the bottom tabs to go back to the primary screen!",
    image: require('../assets/image2.png'),
    // imageStyle: styles.image,
    // backgroundColor: '#008542',
  },
  {
    key: 'RSVP',
    // title: 'Rocket guy',
    // text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
    image: require('../assets/image3.png'),
    // imageStyle: styles.image,
    // backgroundColor: '#0039A6',
  },
  {
    key: 'Redeem',
    // title: 'Title 1',
    // text: 'Description.\nSay something cool',
    image: require('../assets/image4.png'),
    // imageStyle: styles.image,
    // backgroundColor: '#FFB612',
  },
  {
    key: 'Rewards',
    // title: 'Title 2',
    // text: 'Other cool stuff',
    image: require('../assets/image5.png'),
    // imageStyle: styles.image,
    // backgroundColor: '#69BE28',
  },
  {
    key: 'Jobs',
    // title: 'Rocket guy',
    // text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
    image: require('../assets/image6.png'),
    // imageStyle: styles.image,
    // backgroundColor: '#C75B12',
  },
  {
    key: 'Calendar',
    // title: 'Title 2',
    // text: 'Other cool stuff',
    image: require('../assets/image7.png'),
    // imageStyle: styles.image,
    // backgroundColor: '#008542',
  },
  {
    key: 'Drawer',
    // title: 'Rocket guy',
    // text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
    image: require('../assets/image8.png'),
    // imageStyle: styles.image,
    // backgroundColor: '#0039A6',
  }
];

export default class Login extends React.Component {

  state = {
    access_token: undefined,
    expires_in: undefined,
    refreshing: false,
  }

  constructor(props) {
    super(props)
    // StatusBar.setHidden(true)
    this.state = {
      isLoggedIn: false,
      loadingFonts: true
    };
  }

  async componentDidMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      'Ionicons': require('native-base/Fonts/Ionicons.ttf'),
      'Material Design Icons': require('native-base/Fonts/MaterialIcons.ttf'),
      'MaterialCommunityIcons': require('native-base/Fonts/MaterialCommunityIcons.ttf'),
      'FontAwesome': require('native-base/Fonts/FontAwesome.ttf'),
      'Entypo': require('native-base/Fonts/FontAwesome.ttf'),
    });

    //This will happen as soon as the fonts are fully loaded
    this.setState({ loadingFonts: false });
  }

  // This will see if the login token already exists - If it does, go to Main App Screen
  async componentWillMount() {

    // //DISABLING DATA COLLECTION Ref: https://docs.expo.io/versions/latest/sdk/segment.html
    // Segment.setEnabledAsync(false);

    let LOGIN_TOKEN = await AsyncStorage.getItem('LOGIN_TOKEN');
    const sliderState = await AsyncStorage.getItem('sliderState');
    this.setState({ sliderState });
    if (LOGIN_TOKEN == null) {
      // DO nothing and continue login process
      console.log('Login token not found');
    }
    else {
      console.log('Login token has been found');
      let category = await this.chooseCategory();
      console.log(category);
      this.props.navigation.navigate("DrawerNavigator");
    }
  }

  async getUser({ access_token }) {
    this.setState({ refreshing: true })
    const baseApi = 'https://api.linkedin.com/v1/people/'
    const qs = { format: 'json' }
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
    this.setState({
      ...payload,
      refreshing: false,
    })
    let value = this.state.pictureUrl
    if (value == null) {
      AsyncStorage.setItem('userPhoto', 'https://www.utdallas.edu/brand/files/Temoc_Orange.png')
    }
    else {
      AsyncStorage.setItem('userPhoto', this.state.pictureUrl)
    }
    AsyncStorage.setItem('lastName', this.state.lastName),
      AsyncStorage.setItem('firstName', this.state.firstName),
      AsyncStorage.setItem('email', this.state.emailAddress),
      AsyncStorage.setItem('headline', this.state.headline),
      AsyncStorage.setItem('userID', this.state.id),
      AsyncStorage.setItem('location', JSON.stringify(this.state.location)),
      AsyncStorage.setItem('industry', this.state.industry),
      AsyncStorage.setItem('LOGIN_TOKEN', "loggedIn"),
      AsyncStorage.getItem('loggedInStatus',
        (value) => {
          this.setState({ loggedInStatus: 'loggedIn' });
        });
    this.props.navigation.navigate('DrawerNavigator');
  }

  chooseCategory = () => {
    let category = 'student';
    return category;
  }

  renderItem(label, value) {
    return (
      <View style={styles.item}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
        </View>
      </View>
    )
  }

  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    AsyncStorage.setItem('sliderState', 'shown');
    this.setState({ sliderState: 'shown' })
  }

  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons
          name="md-arrow-round-forward"
          color="#000000"
          size={40}
          style={{ backgroundColor: 'transparent' }}
        />
      </View>
    );
  }
  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons
          name="md-checkmark"
          color="#000000"
          size={40}
          style={{ backgroundColor: 'transparent' }}
        />
      </View>
    );
  }

  render() {
    if (this.state.loadingFonts) {
      //The fonts are still loading
      return <Expo.AppLoading />;
    }

    const { emailAddress, pictureUrl, refreshing, firstName, lastName, summary, id, headline, location } = this.state;
    console.log('sliderstate is ' + this.state.sliderState);
    if (this.state.loggedInStatus === 'loggedIn') {
      this.props.navigation.navigate("HomeFeedStack")
    }
    if (!this.state.sliderState) {
      return <AppIntro
        slides={slides}
        // dotStyle={styles.allDotStyle}
        // activeDotStyle={styles.activeDot}
        renderDoneButton={this._renderDoneButton}
        renderNextButton={this._renderNextButton}
        onDone={this._onDone} />;
    }
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
