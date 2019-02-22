import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, AsyncStorage, Camera } from 'react-native';
import { Constants, BarCodeScanner, Permissions, Location } from 'expo';
import * as firebase from 'firebase';
import Geocoder from 'react-native-geocoding';

export default class Qrcode extends Component {

  state = {
    hasCameraPermission: null,
    codeRead: false,
    mode: '',
    ourEventID: '',
    secretKey: '',
    whooshBits: '0',
    hasRedeemed: false,
    usrLinkedInID: '',
    attendedFlag: false,
    isValidSecretKey: '',
    remWhooshBits: 0
  };

  async componentDidMount() {
    this._requestCameraPermission();
    this.setState({
      userID: await AsyncStorage.getItem('userID'),
      emailID: await AsyncStorage.getItem('email'),
    });
    let isAdminRef = firebase.database().ref("Users/" + this.state.userID + "/isAdmin/");
    isAdminRef.on('value', this.isAdminData, this.isAdminerrData);
  }
  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  checkBarcodeRead = (data) => {
    this._handleBarCodeRead(data)
  };

  secretKeyData = (data) => {
    var secretKey = data.val();
    console.log("The secrey KEY is " + secretKey);

    this.state.isValidSecretKey = secretKey
  };

  isAdminData = (data) => {
    this.state.isAdmin = data.val()
  };

  isAdminerrData = (err) => {
    console.log(err);
  };

  errData = (err) => {
    console.log(err);
  };

  // Get user's location
  getUserLocation = (options = {}) => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };


  // Given user's and event's location, calculate and return the distance
  distance = (userlat, userlng, eventlat, eventlng) => {
    return new Promise((resolve, reject) => {
      if ((userlat === eventlat) && (userlng === eventlng)) {
        return 0;
      }
      else {
        var raduserlat = Math.PI * userlat / 180;
        var radeventlat = Math.PI * eventlat / 180;
        var theta = userlng - eventlng;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(raduserlat) * Math.sin(radeventlat) + Math.cos(raduserlat) * Math.cos(radeventlat) * Math.cos(radtheta);
        if (dist > 1) {
          dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        resolve(dist);
      }
    })
  };

  calculateUserHasEnoughWhooshBits = async (ourUserID, whooshBitsRequest) => {
    var remPoints = 0;
    var firebasePointsRef = firebase.database().ref("Users/" + ourUserID + "/points/");
    await firebasePointsRef.on('value', function (snapshot) {
      remPoints = snapshot.val();
      return (parseInt(remPoints) > 0 && parseInt(remPoints) >= parseInt(whooshBitsRequest))
    });
  };


  async _handleBarCodeRead(data) {
    //Data structure: if [0] is "web"
    //[0] = mode, [1] = event ID, [2] = secret key, [3] = whooshbits
    //Data structure: if [0] is "app"
    //[0] = mode, [1] = user's linked ID, [2] = whooshbits to redeem
    this.state.codeRead = true;
    var splitData = data.data.split(',');
    this.state.mode = splitData[0];

    this.state.usrLinkedInID = this.state.userID;
    if(this.state.isAdmin && this.state.mode === 'app'){
      this.state.ourEventID = null;
      this.state.usrLinkedInID = splitData[1];
      this.state.whooshBits = splitData[2];

      let userHasEnoughWhooshBits = this.calculateUserHasEnoughWhooshBits(splitData[1], splitData[2]);
      this.handleUserRedeemQRScan(userHasEnoughWhooshBits)

    }
    else if (this.state.mode ==='web'){
      this.state.ourEventID = splitData[1];
      this.state.secretKey = splitData[2];
      this.state.whooshBits = splitData[3];
      this.handleEventQRScan()
    }
    else {
      Alert.alert(
        'Oh No!',
        "We don't seem to recognize that code. We'd recommend ensuring you're scanning the right kind of QR code.",
        [
          { text: 'Dismiss' },
        ],
        { cancelable: false }
      );
      this.props.navigation.goBack(null);
    }

  }

  handleUserRedeemQRScan(userHasEnoughWhooshBits){
      console.log("QRCODE.JS After WhooshBits Function Call: " + userHasEnoughWhooshBits);
      if (userHasEnoughWhooshBits)
      {
        console.log("Asking for Admin Approval");
        Alert.alert(
            'Admin Approval!',
            'Please approve the following redeem request: \n amount:' + this.state.whooshBits,
            [
              { text: 'Deny', style: 'cancel', onPress: () => this.denyWhooshBitsRedeem() },
              { text: 'Approve', onPress: () => this.approveWhooshBitsRedeem(this.state.whooshBits, this.state.usrLinkedInID) },
            ],
            { cancelable: false }
        );
        this.props.navigation.goBack(null);
      }
      else
      {
        console.log("Informing Admin User has insufficient WB remaining");
        Alert.alert(
            'Error Redeeming!',
            'It looks like this user has insufficient Whoosh Bits to complete transaction',
            [
              { text: 'Ok'},
            ],
            { cancelable: false }
        );
        this.props.navigation.goBack(null);
      }
  }

  handleEventQRScan(){
    let userID = this.state.userID.toString();
    var userHasAttended;

    console.log("RAP SONG USER ID: " + this.state.userID.toString());
    let userHasAttendedRef = firebase.database().ref('Events/' + this.state.ourEventID + '/usersAttended/');

    userHasAttendedRef.child(userID).on('value', function (snapshot) {
      var exists = (snapshot.val() !== null);
      console.log("Has User Already Attended?:" + exists);
      userHasAttended = exists;
    });

    let eventLatitude;
    let eventLongitude;
    var secretKeyRef = firebase.database().ref("Events/" + this.state.ourEventID + "/eventSecretKey/");
    secretKeyRef.on('value', this.secretKeyData, this.errData);
    let eventRef = firebase.database().ref('Events/' + this.state.ourEventID + "/");
    eventRef.once('value', snapshot => {
      let data = snapshot.val();
      eventLatitude = data.eventLatitude;
      eventLongitude = data.eventLongitude;
    });

    console.log("IS VALID SECRET KEY:" + this.state.isValidSecretKey);

    var isValidSecretKeyCheck = false;

    if (this.state.secretKey === this.state.isValidSecretKey) {
      isValidSecretKeyCheck = true;
    }
    else {
      isValidSecretKeyCheck = false;
    }

    var finalAttendedCheck = true;
    var finalGeoLocationCheck = true;
    var finalValidSecretKeyCheck = true;
    var finalRSVPCheck = true;
    var finalAlumniCheck = true;

    //Get User's location
    try {
      var userPosition =  this.getUserLocation();
      // var eventPosition = await this.getEventLocation(); // gets event's location

      var userlat = userPosition.coords.latitude;
      var userlng = userPosition.coords.longitude;
      var eventlat = eventLatitude;
      var eventlng = eventLongitude;

      // get the distance between userPosition and eventPosition
      var distance =  this.distance(userlat, userlng, eventlat, eventlng);

      console.log('User Position: ' + userlat + ', ' + userlng);
      console.log('Event position: ' + eventlat + ',' + eventlng);
      console.log('Distance: ' + distance);

    } catch (error) {
      console.log(error);
    }

    var isUserAlumni = null;
    var userAlumniCheck = firebase.database().ref("Users/" + this.state.usrLinkedInID + '/classification/');
    userAlumniCheck.on('value', function (snapshot) {
      if (snapshot.val() == 'alumni')
      {
        isUserAlumni = true;
      }
      else if (snapshot.val() == 'student'){
        isUserAlumni = false;
      }
      console.log("Is User an Alumni?:" + isUserAlumni)
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////
    var userHasRSVPd = false;
    var rsvpCheckRef = firebase.database().ref("Events/" + this.state.ourEventID + "/usersRsvp/" + this.state.usrLinkedInID + '/');
    rsvpCheckRef.on('value', function (snapshot) {
      var exists = (snapshot.val() !== null);
      console.log("Has User RSVP'd?:" + exists);
      userHasRSVPd = exists;
    });
    ////////////////////////////////////////////////////////////////////////////////////////////////

    var isAlumniEvent = null;
    var alumniEventRef = firebase.database().ref("Events/" + this.state.ourEventID + "/eventClassification/");
    alumniEventRef.on('value', function (snapshot) {
      if (snapshot.val() === 'alumni')
      {
        isAlumniEvent = true;
      }
      else if (snapshot.val() === 'student'){
        isAlumniEvent = false;
      }
      console.log("Is the event open to Alumni Only?:" + isAlumniEvent)
    });

    if (isAlumniEvent && !isUserAlumni) {
      Alert.alert(
          'Oops!',
          "This event is open to Alumni only. If you are an Alumnus but are unable to scan the QR code, please speak to an event coordinator.",
          [
            { text: 'Oh Ok', onPress: () => console.log('User tried to cheat the system') },
          ],
          { cancelable: false }
      );
      finalAlumniCheck = false;

      this.props.navigation.goBack(null);
    }
  else if (!userHasRSVPd) {
      Alert.alert(
          'Oops!',
          "Looks like you haven't RSVP'd for this event. Try to RSVP and scan again!",
          [
            { text: 'Oh Ok', onPress: () => console.log('User tried to cheat the system') },
          ],
          { cancelable: false }
      );
      finalRSVPCheck = false;
      this.props.navigation.goBack(null);
    }
    else if (distance > 0.0852273) { //150 YARDS
      Alert.alert(
          'Oops!',
          "Looks like you're more than 150 yards away from the event. Maybe try getting closer and scanning again?",
          [
            { text: 'Alright', onPress: () => console.log('User tried to cheat the system') },
          ],
          { cancelable: false }
      );
      finalGeoLocationCheck = false;
      this.props.navigation.goBack(null);
    }
    else if (userHasAttended) {
      Alert.alert(
          'Oops!',
          "Looks like you've already scanned this QR code. If you have an issue, please leave us a feedback!",
          [
            { text: 'Cool!', onPress: () => console.log('User tried to cheat the system') },
          ],
          { cancelable: false }
      );
      finalAttendedCheck = false;
      this.props.navigation.goBack(null);
    }
    else if (!isValidSecretKeyCheck) {
      Alert.alert(
          'Uh Oh',
          "This QR code isn't what we're expecting!. Try scanning again or talk to an event coordinator.",
          [
            { text: 'Ok', onPress: () => console.log('User tried to cheat the system') },
          ],
          { cancelable: false }
      );
      finalValidSecretKeyCheck = false;
      this.props.navigation.goBack(null);
    }
    else if (finalAttendedCheck && finalValidSecretKeyCheck && finalGeoLocationCheck && finalRSVPCheck && finalAlumniCheck) {
      Alert.alert(
          this.state.whooshBits + ' Whoosh Bits Redeemed!',
          'Thanks for attending! \n \nWe look forward to seeing you again!',
          [
            { text: 'Thanks!', onPress: () => this.addWhooshBitsToUser() },
          ],
          { cancelable: false }
      );
      this.props.navigation.goBack(null);
    }
  }

  approveWhooshBitsRedeem(redeemVal, usersID) {
    console.log("WHOOSH BITS APPROVED!");

    let pointsRef = firebase.database().ref('Users/' + usersID + '/points/');
    pointsRef.transaction(function (points) {
      return (points) - redeemVal;
    }).then(function () {
      console.log('POINTS UPDATED IN FIREBASE!');
    })
      .catch(function (error) {
        console.log('POINTS NOT UPDATED: ' + error);
      });


    Alert.alert(
      'Yay!',
      "Whoosh Bits Redeemed!",
      [
        { text: 'Cool!' },
      ],
      { cancelable: false }
    );
    this.props.navigation.goBack(null);
  }

  denyWhooshBitsRedeem() {
    console.log("WHOOSH BITS DENIED!");

    Alert.alert(
      'DENIED!',
      "The redeem request has been denied!",
      [
        { text: 'Thanks!' },
      ],
      { cancelable: false }
    );
    this.props.navigation.goBack(null);

  }

  getEventData = (data) => {
    var eventsObject = data.val();
    var eventID = Object.keys(eventsObject);
    console.log(eventID[0]);
    console.log(eventID[1]);
  };

  addWhooshBitsToUser() {
    console.log("ADDING WHOOSH BITS TO USER & ATTDING USER TO ATTENDED LIST");

    let userHasAttendedRef = firebase.database().ref('Events/' + this.state.ourEventID + '/usersAttended/');
    var linkedInID = this.state.usrLinkedInID;
    userHasAttendedRef.child(linkedInID).set(this.state.emailID).then(function () {
      console.log('User added to attended list!');
    })
      .catch(function (error) {
        console.log('User not added to attended list!' + error);
      });

    console.log('USER ID FROM QR CODE PAGE: ' + this.state.userID.toString());

    var eventObjectData = firebase.database().ref("Events/");
    eventObjectData.on('value', this.getEventData, this.errData);

    let numEventRef = firebase.database().ref('Users/' + this.state.userID.toString() + '/numOfEvents/');
    let pointsRef = firebase.database().ref('Users/' + this.state.userID.toString() + '/points/');

    numEventRef.transaction(function (numOfEvents) {
      return (numOfEvents || 0) + 1;
    }).then(function () {
      console.log('NUMBER OF EVENTS UPDATED IN FIREBASE!');
    })
      .catch(function (error) {
        console.log('NUMBER OF EVENTS NOT UPDATED: ' + error);
      });
    console.log('WHOOSH BITS TRANSACTION: ' + this.state.whooshBits);
    console.log('POINTS TRANSACTION TYPE: ' + typeof (parseInt(this.state.whooshBits)));
    var jack = parseInt(this.state.whooshBits);
    pointsRef.transaction(function (points) {
      return (points || 0) + jack;
    }).then(function () {
      console.log('POINTS UPDATED IN FIREBASE!');
    })
      .catch(function (error) {
        console.log('POINTS NOT UPDATED: ' + error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.hasCameraPermission === null ?
          <Text>Requesting permission to use camera ...</Text> :
          this.state.hasCameraPermission === false ?
            <Text>Camera permission is not granted</Text> :
              <BarCodeScanner
                  onBarCodeRead={this.checkBarcodeRead}
                  style={{ height: '100%', width: '100%' }}
              />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //paddingTop: Constants.statusBarHeight,
    backgroundColor: '#000000',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});