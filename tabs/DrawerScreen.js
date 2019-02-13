/**
 * JonssonConnect DrawerScreen Page
 * Developed in part by Manu, Akshay, Vignesh, Ramya, & Jahnavi
 */

import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { ScrollView, Text, View, Linking, TouchableOpacity, ActivityIndicator, AsyncStorage, ImageBackground, Image } from 'react-native';
import { DrawerActions } from 'react-navigation';
import RF from 'react-native-responsive-fontsize';
import { Container, Header, Content, Card, CardItem, Thumbnail, List, Icon, ListItem, Item, Input, Title, Button, Left, Body, Right, H1, H2, H3 } from 'native-base';
import { Permissions, Notifications } from 'expo';
import * as firebase from 'firebase';


export default class DrawerScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isAdminCheck: false,
    }
  }

  navigateToScreen = (route) => () => {
    console.log('DrawerScreen has been fired');
  }

  navigateToRewardsPage = () => {
    console.log('navigateToRewardsPage has been executed');
    this.props.navigation.navigate("Rewards");
  }
  navigateToHelpPage = () => {
    console.log('navigateToHelpPage has been executed');
    this.props.navigation.navigate("Help");
  }

  logout = () => {
    console.log("Logging out");
    AsyncStorage.clear();
    this.props.navigation.navigate('Login');
  }

  // componentDidMount = async() => {
  //   this.setState({
  //     firstName: await AsyncStorage.getItem('firstName'),
  //     lastName: await AsyncStorage.getItem('lastName'),
  //     userPhoto: await AsyncStorage.getItem('userPhoto'),
  //     headline: await AsyncStorage.getItem('headline'),
  //     location: await AsyncStorage.getItem('location'),
  //     industry: await AsyncStorage.getItem('industry'),
  //   }, this.setState({ isLoading: false }));
  // }

  async componentWillMount() {

    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });

    this.setState({
      firstName: await AsyncStorage.getItem('firstName'),
      lastName: await AsyncStorage.getItem('lastName'),
      userPhoto: await AsyncStorage.getItem('userPhoto'),
      headline: await AsyncStorage.getItem('headline'),
      location: await AsyncStorage.getItem('location'),
      industry: await AsyncStorage.getItem('industry'),
      userID: await AsyncStorage.getItem('userID')
    });

    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );

    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    console.log('The updated token is ' + token);

    let userID = await AsyncStorage.getItem('userID');
    
    // get firstname and lastname from state
    let firstName = await AsyncStorage.getItem('firstName');
    let lastName = await AsyncStorage.getItem('lastName');

    // Writing user's firstname, lastname, and notification token to firebase
    let userRef = firebase.database().ref('Users/' + userID);
    userRef.update({
      notificationToken: token,
    }).then(function () {
      console.log('Notification Token Assigned!');
    })
      .catch(function (error) {
        console.log('NOTIFICATION TOKEN WAS NOT ASSIGNED!' + error);
      });

    userRef.update({
      firstName: firstName,
      lastName: lastName,
    }).then(function () {
      console.log('User\'s First Name & Last Name set successfully!');
    })
      .catch(function (error) {
        console.log('FIRST NAME & LAST NAME NOT SET!' + error);
      });
  }

  isAdminData = (data) => {
    this.state.isAdminCheck = data.val()
    // console.log("@@@@@@@@@@ The admin  is " + this.state.isAdminCheck)
    //this.state.isAdminCheck = isAdmin;
    
  }

  isAdminerrData = (err) => {
    console.log(err);
  }

  render() {

    var isAdminRef = firebase.database().ref("Users/" + this.state.userID + "/isAdmin/");
    isAdminRef.on('value', this.isAdminData, this.isAdminerrData);

    if (!this.state.firstName) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }

   // console.log('These are all the state values' + this.state.firstName + this.state.lastName);

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
      "Saturday"
    ]

    const date = new Date();
    let day = days[date.getDay()]
    var month = monthNames[date.getMonth()]
    var dateNum = date.getDate()
    //console.log(month + ' ' + dateNum);
    var theUserID = this.state.userID;

    var kaiser = this.state.isAdminCheck;

    return (
      <View>
        <ScrollView>
          <View>
              <View>
                <ImageBackground style={styles.backdrop} source={require('../images/image7.jpg')} blurRadius={1.5}>
                <View style={styles.photo} >
                  <Thumbnail large source={{ uri: this.state.userPhoto.toString() }} />
                </View>

                <View style={styles.userInfo}>
                  <Text style={{ textAlign: 'center', fontSize: RF(3), fontWeight: '700', color: '#FFFFFF' }} >{this.state.firstName.toString()} {this.state.lastName.toString()}</Text>
                  {/* <Text style={{ fontSize: 20, fontWeight: '700', color: '#FFFFFF' }} >{this.state.lastName.toString()}</Text> */}
                </View>

                <View style={styles.industryInfo}>
                  <Text style={{ fontSize: 14, fontWeight: '300', color: '#FFFFFF' }} >
                  <Icon name='ios-pin' style={{ fontSize: 14, color: '#FFFFFF' }} />
                  {" "}{this.state.location.toString().replace(/{"name":"/g, '').replace(/"}/g, '')}
                  </Text>
                </View>

                <View style={styles.industryInfo}>
                  <Text style={{ fontSize: 14, fontWeight: '300', color: '#FFFFFF' }} >
                  <Icon name='ios-globe' style={{ fontSize: 14, color: '#FFFFFF' }} />
                  {" "}{this.state.industry.toString()}
                  </Text>
                </View>
                </ImageBackground>
              </View>
            <View style={styles.sidebarDay}>
              <Text style={styles.day} onPress={this.navigateToScreen()}>
                {day + ','}
              </Text>
            </View>
            <View style={styles.sidebarDate}>
            <Text style={styles.date} onPress={this.navigateToScreen()}>
                {month + ' ' + dateNum}
              </Text>
            </View>

            <TouchableOpacity style={styles.sidebar}>
              {/* <Icon type="FontAwesome" name='gift' size={5} /> */}
                <Icon type="FontAwesome" name='gift'  style={{color: '#c75b12'}} onPress={this.navigateToRewardsPage}/>
              <Text style={styles.settingsStyle} onPress={() => this.navigateToRewardsPage()}>
                Rewards
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebar}
              onPress={() => { Linking.openURL('https://giving.utdallas.edu/ECS') }}>
                <Icon type="FontAwesome" name='dollar' style={{color: '#c75b12'}} onPress={this.navigateToScreen()}/>
              <Text style={styles.settingsStyle} onPress={this.navigateToScreen()}>
                Donate Now
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebar}>
                <Icon type="FontAwesome" name='question'  style={{color: '#c75b12'}}/>
              <Text style={styles.settingsStyle} onPress={() => this.navigateToHelpPage()}>
                Help & Feedback
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebar}>
              <Icon type="FontAwesome" name='qrcode'  style={{color: '#c75b12'}}/>
              <Text style={styles.settingsStyle} onPress={() => this.props.navigation.navigate('Qrcode', {theUserID, kaiser})}>
                Scan QR Code
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebar}>
              <Icon type='FontAwesome' name='arrow-circle-o-left' style={{color: '#c75b12'}}/>
              <Text style={styles.settingsStyle} onPress = {() => this.logout()}>
                Logout
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.sidebar}
              transparent onPress={() => navigation.navigate('Profile')
              }>
              <Icon style={styles.logOut} type="Ionicons" name='ios-log-out' size={10} />
              <Text style={styles.logOutText} onPress={this.navigateToScreen()}>
                Log Out
              </Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </View>
    );
  }
}



DrawerScreen.propTypes = {
  navigation: PropTypes.object
  
};

const styles = {

  backdrop: {
    width: '100%',
    height: '100%',
    flex: 1,
  },

  sidebar: {

    padding: 14,
    paddingLeft: 20,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'

  },
  day: {
    fontWeight: 'bold',
    fontSize: 15,
    paddingTop: 20
  },
  date: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingBottom: 10
  },
  logOut: {
    color: 'red',
    textAlign: 'auto',
    fontWeight: 'bold'
  },
  logOutText: {
    color: 'red',
    paddingLeft: 10,
    lineHeight: 25,
    textAlign: 'auto',
    fontWeight: 'bold',
    fontSize: 18
  },
  settingsStyle: {
    paddingLeft: 10,
    textAlign: 'auto',
    fontWeight: 'bold',
    fontSize: 15,
  },
  sidebarDate: {
    paddingLeft: 25,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  sidebarDay: {
    paddingLeft: 25,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  backdropView: {
    paddingTop: 10,
    width: 200,
    backgroundColor: 'rgba(0,0,0,0)',
    paddingLeft: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    paddingBottom: 3,
  },
  userInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: 5
  },
  industryInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    paddingBottom: 4,
  }
}