import React, {Component} from 'react';
import {Alert, AsyncStorage, Camera, StyleSheet, Text, View} from 'react-native';
import {BarCodeScanner, Permissions,Location} from 'expo';
import * as firebase from 'firebase';

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
    this._getLocationAsync();
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

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    this.setState({hasLocationPermission:(status !== 'granted')})

    let location = await Location.getCurrentPositionAsync({});
    this.setState({location: { latitude: location.coords.latitude, longitude: location.coords.longitude }});
  };

  checkBarcodeRead = (data) => {
    if (!this.state.codeRead) {
      this.state.codeRead = true
      this._handleBarCodeRead(data)
    }
  };

  secretKeyData = (data) => {
    var secretKey = data.val();
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

  // Given user's and event's location, calculate and return the distance
  distance = (userlat, userlng, eventlat, eventlng) => {
      //If there's no location requirement accept anything
      if(!eventlat || !eventlng)
        return 0;
      else if (!userlng || !userlng) {
        //This is the case where a location is required AND the user's permissions hasn't allowed for reading location
        return 100;
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
        return(dist);
      }
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
    if( this.state.mode && this.state.isAdmin === 'true' && this.state.mode === 'app'){
      this.state.ourEventID = null;
      this.state.usrLinkedInID = splitData[1];
      this.state.whooshBits = splitData[2];

      let userHasEnoughWhooshBits = this.calculateUserHasEnoughWhooshBits(splitData[1], splitData[2]);
      this.handleUserRedeemQRScan(userHasEnoughWhooshBits)

    }
    else if ( this.state.mode && this.state.mode ==='web'){
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
          { text: 'Dismiss',onPress: ()=> this.props.navigation.goBack(null)},
        ],
        { cancelable: false }
      );

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
              { text: 'Dismiss',onPress: () => this.props.navigation.goBack(null)},
            ],
            { cancelable: false }
        );
      }
  }

  handleEventQRScan(){

    //Check if user has already attended
    let userHasAttended;
    let userHasAttendedRef = firebase.database().ref('Events/' + this.state.ourEventID + '/usersAttended/');
    userHasAttendedRef.child(this.state.userID).on('value', function (snapshot) {
      userHasAttended = (snapshot.val() !== null);
      console.log("Has User Already Attended?:" + userHasAttended);
    });

    //Check if the qr code's key matches the event key
    var secretKeyRef = firebase.database().ref("Events/" + this.state.ourEventID + "/eventSecretKey/");
    secretKeyRef.on('value', this.secretKeyData, this.errData);
    var isValidSecretKeyCheck = this.state.secretKey === this.state.isValidSecretKey

    //get the event's lat and long
    let eventLatitude = 0;
    let eventLongitude = 0;
    let locationRequired = false;
    let eventRef = firebase.database().ref('Events/' + this.state.ourEventID + "/");
    eventRef.once('value', snapshot => {
      let data = snapshot.val();
      eventLatitude = data.eventLatitude;
      eventLongitude = data.eventLongitude;
      if (eventLatitude && eventLongitude)
        locationRequired = true
    });

    //This ensures we have the user's location, but only if it's required for the event
    const missingRequiredUserLocation = !this.state.location && locationRequired

    //Check if user is at the location
    //this is 0 if the event has no location
    let distance = 0
    if (!missingRequiredUserLocation)
      distance = this.distance(this.state.location.latitude, this.state.location.longitude, eventLatitude, eventLongitude);

    //check if user is alumni
    let isUserAlumni = null;
    const userAlumniCheck = firebase.database().ref("Users/" + this.state.usrLinkedInID + '/classification/');
    userAlumniCheck.on('value', function (snapshot) {
      isUserAlumni = snapshot.val() === 'alumni'
      console.log("Is User an Alumni?:" + isUserAlumni)
    });

    //Check if user has RSVPd
    var userHasRSVPd = false;
    var rsvpCheckRef = firebase.database().ref("Events/" + this.state.ourEventID + "/usersRsvp/" + this.state.usrLinkedInID + '/');
    rsvpCheckRef.on('value', function (snapshot) {
      var exists = (snapshot.val() !== null);
      console.log("Has User RSVP'd?:" + exists);
      userHasRSVPd = exists;
    });

    //Check if event us alumni only
    var isAlumniEvent = null;
    var alumniEventRef = firebase.database().ref("Events/" + this.state.ourEventID + "/eventClassification/");
    alumniEventRef.on('value', function (snapshot) {
      isAlumniEvent = snapshot.val() === 'alumni'
      console.log("Is the event open to Alumni Only?:" + isAlumniEvent)
    });


    //The series of checks to see if whooshbits should be redeemed
    if (userHasAttended) {
      Alert.alert(
          'Oops!',
          "Looks like you've already scanned this QR code. If you have an issue, please leave us a feedback!",
          [
            { text: 'Dismiss', onPress: () => this.props.navigation.goBack(null) },
          ],
          { cancelable: false }
      );
    }
    else if (isAlumniEvent && !isUserAlumni) {
      Alert.alert(
          'Oops!',
          "This event is open to Alumni only. If you are an Alumnus but are unable to scan the QR code, please speak to an event coordinator.",
          [
            { text: 'Dismiss', onPress: () => this.props.navigation.goBack(null) },
          ],
          { cancelable: false }
      );
    }
    else if (!userHasRSVPd) {
      Alert.alert(
          'Oops!',
          "Looks like you haven't RSVP'd for this event. Try to RSVP and scan again!",
          [
            { text: 'Dismiss', onPress: () => this.props.navigation.goBack(null) },
          ],
          { cancelable: false }
      );
    }
    else if (missingRequiredUserLocation) {
      Alert.alert(
          'Location Error',
          "This event requires you to be at a certain location, please ensure you've given adequate permission for this app to use your location.",
          [
            { text: 'Dismiss', onPress: () => this.props.navigation.goBack(null) },
          ],
          { cancelable: false }
      );
    }
    else if (distance > 0.0852273) { //150 YARDS
      Alert.alert(
          'Oops!',
          "Looks like you're more than 150 yards away from the event. Maybe try getting closer and scanning again?",
          [
            { text: 'Dismiss', onPress: () => this.props.navigation.goBack(null) },
          ],
          { cancelable: false }
      );
    }
    else if (!isValidSecretKeyCheck) {
      Alert.alert(
          'Uh Oh',
          "This QR code isn't what we're expecting!. Try scanning again or talk to an event coordinator.",
          [
            { text: 'Ok', onPress: () => this.props.navigation.goBack(null) },
          ],
          { cancelable: false }
      );
    }
    else{
      this.addWhooshBitsToUser();

      firebase.database().ref('Users/' + this.state.userID + '/attendedList/' + this.state.ourEventID).set(true);

      Alert.alert(
          this.state.whooshBits + ' Whoosh Bits Redeemed!',
          'Thanks for attending! \n \nWe look forward to seeing you again!',
          [
            { text: 'Dismiss', onPress: () => this.props.navigation.goBack(null)},
          ],
          { cancelable: false }
      );
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
        { text: 'Dismiss',onPress: () => this.props.navigation.goBack(null) },
      ],
      { cancelable: false }
    );
  }

  denyWhooshBitsRedeem() {
    console.log("WHOOSH BITS DENIED!");

    Alert.alert(
      'DENIED!',
      "The redeem request has been denied!",
      [
        { text: 'Dismiss',onPress: () => this.props.navigation.goBack(null) },
      ],
      { cancelable: false }
    );
  }


  getEventData = (data) => {
    var eventsObject = data.val();
    var eventID = Object.keys(eventsObject);
    console.log(eventID[0]);
    console.log(eventID[1]);
  };

  addWhooshBitsToUser() {
    //Update list of attended events in user table

    let eventsAttended = firebase.database.ref('Users/' + this.state.usrLinkedInID + '/eventsAttended');
    eventsAttended.once('value').then((snapshot) => {
      let eventList = snapshot.val();
      if(!eventList) {
        eventList = [];
      }

      if(!eventList.includes(this.state.ourEventID)) {
        eventList.push(this.state.ourEventID);
      }

      eventsAttended.set(eventList);
    });


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

    var pointsToAdd = parseInt(this.state.whooshBits);
    pointsRef.transaction(function (points) {
      return (points || 0) + pointsToAdd;
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
    backgroundColor: '#000000',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
