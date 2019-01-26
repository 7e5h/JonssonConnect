import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, AsyncStorage, Camera } from 'react-native';
import { Constants, BarCodeScanner, Permissions, Location } from 'expo';
import * as firebase from 'firebase';
import Geocoder from 'react-native-geocoding';

export default class Qrcode extends Component {

  state = {
    hasCameraPermission: null,
    isBarcodeRead: true,
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
      emailID: await AsyncStorage.getItem('email'),
    });
  }
  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  checkBarcodeRead = (data) => {
    this._handleBarCodeRead(data)
  }

  secretKeyData = (data) => {
    var secretKey = data.val()
    console.log("The secrey KEY is " + secretKey)

    this.state.isValidSecretKey = secretKey
  }

  errData = (err) => {
    console.log(err);
  }

  // Get user's location
  getUserLocation = (options = {}) => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  // Get event's location
  // Reads Firebase for event info and passes the address to geocode()
  // Returns coordinates received from geocode()
  // getEventLocation = () => {
  //   Geocoder.init('AIzaSyAb53PEyP1lP9m4X4BUTpBUbA-7hxAcPmc');
  //   let eventRef = firebase.database().ref('Events/' + this.state.ourEventID);

  //   return new Promise((resolve, reject) => {
  //     // Read the scanned event's data from firebase and get the event address
  //     eventRef.once('value', snapshot => {
  //       let eventLocation;
  //       let data = snapshot.val();
  //       eventLocation = data.eventLocation;
  //       this.geocode(eventLocation).then((eventCoordinates) => {
  //         resolve(eventCoordinates);
  //       });
  //     })
  //   });
  // }

  // // Transform event address to coordinates and return (lat,lng)
  // geocode = (eventLocation) => {
  //   return new Promise((resolve, reject) => {
  //     Geocoder.from(eventLocation)
  //       .then(json => {
  //         var location = json.results[0].geometry.location;
  //         return location;
  //       }).then((location) => {
  //         if (location) {
  //           console.log('Promise resolved');
  //           resolve(location);
  //         }
  //         else {
  //           console.log('Promise error');
  //           reject('Error in promise');
  //         }
  //       })
  //       .catch(error => console.warn(error));
  //   })
  // }

  // Given user's and event's location, calculate and return the distance
  distance = (userlat, userlng, eventlat, eventlng) => {
    return new Promise((resolve, reject) => {
      if ((userlat == eventlat) && (userlng == eventlng)) {
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
  }

  // isAdminData = (data) => {
  //   this.state.isAdminCheck = data.val()
  //   console.log("The admin  is " + this.state.isAdminCheck)
  //   //this.state.isAdminCheck = isAdmin;

  // }

  // isAdminerrData = (err) => {
  //   console.log(err);
  // }

  // isAdminUpdate = (updatedStateValue) => {

  //   if (updatedStateValue)
  //   {
  //     return true;
  //   }
  //   else{
  //     return false;
  //   }
  // }

  // rsvpCheckRefGotData = (myData) => {
  //   var someData = myData.val()
  //   console.log("CHECKING &&&&&&&&&&&&&&^%$#: " + JSON.stringify(someData))
  // }

  // rsvpCheckRefErrData = (errData) => {
  //   console.log("ERROR!: " + errData)
  // }

  // getCurrentWhooshBits = () => {

  // }

  whooshBitsCheck = (ourUserID, whooshBitsRequest) => {
    
    // var remPoints = this.getCurrentWhooshBits(ourUserID);
    var remPoints = 0;
    var remPointsCheck = false;
    var firebasePointsRef = firebase.database().ref("Users/" + ourUserID + "/points/");
        firebasePointsRef.on('value', function (snapshot) {
          remPoints = snapshot.val()
            console.log("QRCode.js WHOOSHBITS CHECK INSIDE FUNCTION: " + remPoints)
          });

          this.state.remWhooshBits = remPoints;
          console.log("QRCode.js State Rem Whoosh Bits Val 1: " + this.state.remWhooshBits)

          if (remPoints > 0 && remPoints >= parseInt(whooshBitsRequest))
          {
            remPointsCheck = true;
            console.log("QRCode.js User has enough whoosh bits")
          }
          else
          {
            remPointsCheck = false;
            console.log("QRCode.js User does not have enough whoosh bits")
          }

          return remPointsCheck;
  }
  
  async _handleBarCodeRead(data) {
    var temp = JSON.stringify(data);
    var temp2 = temp.split(':');
    var temp3 = temp2[2].split('\"');
    var eventId;
    console.log("TEMP3 DATA[1]: " + temp3[1]);
    var splitData = temp3[1].split(',');
    eventId = splitData[1];
    this.state.mode = splitData[0];
    if (this.state.mode === 'web') {  //[0] = mode, [1] = event ID, [2] = secret key, [3] = whooshbits
      this.state.ourEventID = splitData[1];
      this.state.secretKey = splitData[2];
      this.state.whooshBits = splitData[3];
      console.log("Mode (app/web): " + splitData[0]);
      console.log("Event ID: " + splitData[1]);
      console.log("Secret Key: " + splitData[2]);
      console.log("Whoosh Bits: " + splitData[3]);
    }
    else if (this.state.mode === 'app') {    //[0] = mode, [1] = user's linked ID, [2] = whooshbits to redeem
      this.state.ourEventID = null;
      this.state.usrLinkedInID = splitData[1];
      this.state.whooshBits = splitData[2];
      console.log("Mode (app/web): " + splitData[0]);
      console.log("User ID: " + splitData[1]);
      console.log("Whoosh Bits: " + splitData[2]);
    }
    else {
      console.log("EMAIL ID FROM QRCODE.JS: " + this.state.emailID)
    }

    var isWhooshBitsZero = this.whooshBitsCheck(splitData[1], splitData[2]);
    console.log("QRCode.js State Rem Whoosh Bits Val 2: " + this.state.remWhooshBits)
    var data1 = 'userID: ' + splitData[1];  //COMES FROM Agenda.js
    this.state.usrLinkedInID = this.props.navigation.state.params.theUserID.toString();
    var data2 = 'Whoosh Bits Redeeming: ' + this.state.whooshBits;
    var data3 = 'Whoosh Bits Remaining: ' + this.state.remWhooshBits;

    if (this.state.mode == 'app' && (this.props.navigation.state.params.kaiser.toString() === 'true'))
    {
      
      console.log("QRCODE.JS After WhooshBits Function Call: " + isWhooshBitsZero)
      if (isWhooshBitsZero)
      {
        console.log("Asking for Admin Approval")
        Alert.alert(
          'Admin Approval!',
          'Please approve the following redeem request: \n ' + data1 + '\n ' + data3 + '\n ' + data2,
          [
            { text: 'Deny', style: 'cancel', onPress: () => this.denyWhooshBitsRedeem() },
            { text: 'Approve', onPress: () => this.approveWhooshBitsRedeem(this.state.whooshBits, splitData[1]) },
          ],
          { cancelable: false }
        )
        this.props.navigation.goBack(null);
      }
      else
      {
        console.log("Informing Admin User has insufficient WB remaining")
        Alert.alert(
          'Error Redeeming!',
          'It looks like this user has insufficient Whoosh Bits to complete transaction: \n ' + data1 + '\n ' + data3 + '\n ' + data2,
          [
            { text: 'Ok'},
          ],
          { cancelable: false }
        )
        this.props.navigation.goBack(null);
      }
    }
    else if (this.state.mode == 'web' && (!this.state.hasRedeemed)) {
      let userId = this.props.navigation.state.params.theUserID.toString();
      var userHasAttended;

      console.log("RAP SONG USER ID: " + this.props.navigation.state.params.theUserID.toString())
      let userHasAttendedRef = firebase.database().ref('Events/' + this.state.ourEventID + '/usersAttended/');

      userHasAttendedRef.child(userId).on('value', function (snapshot) {
        var exists = (snapshot.val() !== null)
        console.log("Has User Already Attended?:" + exists)
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

      console.log("IS VALID SECRET KEY:" + this.state.isValidSecretKey)

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

      try {
        var userPosition = await this.getUserLocation(); // gets user's current location
        // var eventPosition = await this.getEventLocation(); // gets event's location

        var userlat = userPosition.coords.latitude;
        var userlng = userPosition.coords.longitude;
        var eventlat = eventLatitude;
        var eventlng = eventLongitude;

        // get the distance between userPosition and eventPosition
        var distance = await this.distance(userlat, userlng, eventlat, eventlng);

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
        var exists = (snapshot.val() !== null)
        console.log("Has User RSVP'd?:" + exists)
        userHasRSVPd = exists;
      });
      ////////////////////////////////////////////////////////////////////////////////////////////////

      var isAlumniEvent = null;
      var alumniEventRef = firebase.database().ref("Events/" + this.state.ourEventID + "/eventClassification/");
      alumniEventRef.on('value', function (snapshot) {
        if (snapshot.val() == 'alumni')
        {
          isAlumniEvent = true;
        }
        else if (snapshot.val() == 'student'){
          isAlumniEvent = false;
        }
        console.log("Is the event open to Alumni Only?:" + isAlumniEvent)
      });

      if (isAlumniEvent && (this.props.navigation.state.params.kaiser.toString() === 'false') && !isUserAlumni)
      {
        console.log("ADMIN CHECK WITHIN OPEN TO ALUMNI ONLY: " + this.props.navigation.state.params.kaiser.toString())
        Alert.alert(
          'Oops!',
          "This event is open to Alumni only. If you are an Alumnus but are unable to scan the QR code, please speak to an event coordinator.",
          [
            { text: 'Oh Ok', onPress: () => console.log('User tried to cheat the system') },
          ],
          { cancelable: false }
        )
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
        )
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
        )
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
        )
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
        )
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
        )
        this.props.navigation.goBack(null);
      }
    }
    else {
      Alert.alert(
        'Oh Dear!',
        "We're terribly sorry but something somewhere took a hard left turn. We'd recommend scanning the QR code once again or showing the QR code to an approved event coordinator.",
        [
          { text: 'You Got It!' },
        ],
        { cancelable: false }
      )
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
    )
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
    )
    this.props.navigation.goBack(null);

  }

  getEventData = (data) => {
    var eventsObject = data.val()
    var eventID = Object.keys(eventsObject)
    console.log(eventID[0]);
    console.log(eventID[1]);
  }

  errData = (err) => {
    console.log(err);
  }

  addWhooshBitsToUser() {
    console.log("ADDING WHOOSH BITS TO USER & ATTDING USER TO ATTENDED LIST")

    let userHasAttendedRef = firebase.database().ref('Events/' + this.state.ourEventID + '/usersAttended/');
    var linkedInID = this.state.usrLinkedInID;
    userHasAttendedRef.child(linkedInID).set(this.state.emailID).then(function () {
      console.log('User added to attended list!');
    })
      .catch(function (error) {
        console.log('User not added to attended list!' + error);
      });

    console.log('USER ID FROM QR CODE PAGE: ' + this.props.navigation.state.params.theUserID.toString())

    var eventObjectData = firebase.database().ref("Events/");
    eventObjectData.on('value', this.getEventData, this.errData);

    let numEventRef = firebase.database().ref('Users/' + this.props.navigation.state.params.theUserID.toString() + '/numOfEvents/');
    let pointsRef = firebase.database().ref('Users/' + this.props.navigation.state.params.theUserID.toString() + '/points/');

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
              // aspect={Camera.constants.Aspect.fill}
              // playSoundOnCapture
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