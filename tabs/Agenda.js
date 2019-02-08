/**
 * JonssonConnect Events Page
 * Developed in part by Manu, Akshay, Vignesh, Ramya, & Jahnavi
 */

import React, { Component } from 'react';
import moment from 'moment';

import { Alert, ActivityIndicator, Image, ListView, FlatList, StyleSheet, View, Linking, RefreshControl, TextInput, ImageBackground, TouchableHighlight, TouchableOpacity, Button, AsyncStorage } from 'react-native';

//import { createBottomTabNavigator, createStackNavigator } from "react-navigation";
import { Container, Header, Content, Card, CardItem, Thumbnail, List, ListItem, Icon, Item, Input, Text, Title, Left, Body, Right, H1, H2, H3 } from 'native-base';
//import * as firebase from 'firebase';

//import firebaseApp from './EventDetails';
//import config from './EventDetails';
import { createBottomTabNavigator, createStackNavigator } from "react-navigation";
import * as firebase from 'firebase';

import firebaseApp from './EventDetails';
import config from './EventDetails';


export default class Events extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      userIdLoading: true,
      userID: '',
      isAdminCheck: false,
    }
  }

  async componentDidMount() {
    console.log("This is Date string from EventCalendar.js in componentDID: " + this.props.navigation.state.params.day.dateString)
    var hardcodeDate = this.props.navigation.state.params.day.dateString

    var myDates = hardcodeDate.split("-")
            var yearKalasala = myDates[0]
            var moKalasala = myDates[1]
            var daKalasala = myDates[2]


            // // if (parseInt(moKalasala) <= 9)
            //     moKalasala = moKalasala[1];
            // // if (parseInt(daKalasala) <= 9)
            //     daKalasala = daKalasala[1];

                hardcodeDate = yearKalasala + "-" + moKalasala + "-" + daKalasala

    console.log("HARDCODED DATE FROM AGENDA: " + hardcodeDate)
    var dateOfEvent = firebase.database().ref("Events/").orderByChild("modifiedDate").startAt(hardcodeDate).endAt(hardcodeDate + "\uf8ff");
    dateOfEvent.on('value', this.gotData, this.errData);

    this.setState({
      userID: await AsyncStorage.getItem('userID'),
      userIdLoading: false,
    });
  }



  gotData = (data) => {
    const { goBack } = this.props.navigation;
    var dates = data.val()
    console.log("DATES TEST: "+JSON.stringify(dates))


    var keys = Object.keys(dates)
    var filteredObjects = new Array();

        for (var i = 0; i < keys.length; i++) 
        {
            var k = keys[i];
            if(dates[k].eventClassification === 'student' || dates[k].eventClassification === 'alumni') //ADD RAP SONG INPLACE OF STUDENT FROM LINE 41
            {
              filteredObjects.push(dates[k])
              // console.log("FILTERED OBJECTS: "+JSON.stringify(dates[k]))
            }
        }

console.log("OBJECT TESTERERE:"+ JSON.stringify(filteredObjects));

        console.log("FILTERED OBJECTS poRGU3U 5-9U]53 : "+JSON.stringify(filteredObjects))

    // console.log("The Dates by child: " + JSON.stringify(dates))
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.setState({
      isLoading: false,
      dataSource: ds.cloneWithRows(filteredObjects),
    }, function () {
      // do something with new state
    });
  }

  errData = (err) => {
    console.log(err);
  }

  rsvpPressed = () => {
    console.log('rsvp button pressed');
    this.props.navigation.navigate("Rsvp");
  }

  qrCodePressed = () => {
    console.log('qrcode button pressed');
    var theUserID = this.state.userID;
    var kaiser = this.state.isAdminCheck;
    this.props.navigation.navigate('Qrcode', { theUserID, kaiser });
  }
  
  tConvert = (time) => {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ':AM' : ':PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
      // time[0] = time[0] + 1;
    }
    return time.join (''); // return adjusted time or original string
  }

  utcToLocal = (time) => {

    var date = new Date(time);
    console.log(date)
    console.log(date.toLocaleDateString())
    var year = date.getFullYear()
    var month = date.getMonth() + 1;
    if (month <= 9)
      month = '0' + month;
    var day = date.getDate();
    if (day <= 9)
      day = '0' + day;
    var fullDate = year + '-' + month + '-' + day;
    //var splitTime = this.tConvert(date.toLocaleTimeString())
    var splitTime = moment(time).local().format("h:mm A");
    //var splitTimeByColon = splitTime.split(":")
    //var stringDate = splitTimeByColon[0] + ":" + splitTimeByColon[1] + " "+splitTimeByColon[3]
    return splitTime;
  }

  isAdminData = (data) => {
    this.state.isAdminCheck = data.val()
    // console.log("@@@@@@@@@@ The admin  is " + this.state.isAdminCheck)
    //this.state.isAdminCheck = isAdmin;
    
  }

  isAdminerrData = (err) => {
    console.log(err);
  }

  // formatTimeHHMMA = (d) => {
  //   function z(n){return (n<10?'0':'')+n}
  //   var h = d.getHours();
  //   return (h%12 || 12) + ':' + z(d.getMinutes()) + ' ' + (h<12? 'AM' :'PM');
  // }

  render() {
    var isAdminRef = firebase.database().ref("Users/" + this.state.userID + "/isAdmin/");
    isAdminRef.on('value', this.isAdminData, this.isAdminerrData);

    if (this.state.isLoading || this.state.userIdLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return (
      <Container style={styles.containerStyle}>
        <Content
        >
          <View style={styles.container2}>
            <ImageBackground
              style={styles.backdrop}
              blurRadius={0}
              source={require('../images/image4.jpg')}
            >
              <View style={styles.backdropView}>
                {/* <Text style={{ fontSize: 35, fontWeight: '200', color: '#FFFFFF' }}>Comet Calendar</Text> */}
              </View>
            </ImageBackground>
          </View>
          <Content>
            <Card>
              <CardItem>
                <Body>
                  <Text style={{ color: '#c75b12', fontSize: 22, fontWeight: '800' }}><Icon name='ios-flame' style={{ fontSize: 32, color: '#c75b12' }} />    Jonsson | Calendar</Text>
                </Body>
                <Icon type="FontAwesome" name='qrcode' style={{color: '#c75b12'}} onPress={this.qrCodePressed} />
              </CardItem>
            </Card>
          </Content>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) => {
              const { uri } = rowData;

              var myDates = rowData.modifiedDate.toString().split("-")
            // var yearKalasala = myDates[0]
            // var moKalasala = myDates[1]
            // var daKalasala = myDates[2]
            var dates = new Date (rowData.eventDate)

            var eventDay = monthNames[parseInt(dates.getMonth())] + ' ' + dates.getDate() + ', ' + dates.getFullYear()
            var eventTime = this.utcToLocal(rowData.eventDate.toString())
            // var eventTime = dates.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})

              return (
                <Content>
                  <List style={{ backgroundColor: '#FFFFFF' }}>
                    <ListItem>
                      <Left>
                        <Body>
                          <Text style={{ fontWeight: '800', fontSize: 16 }}>{rowData.eventTitle}</Text>
                          <Text style={{ fontWeight: '200', fontSize: 12, paddingTop: 5 }}>
                            <Icon name='ios-calendar' style={{ fontSize: 12, color: '#5d5d5d' }} /> {eventDay}
                          </Text>
                          <Text style={{ fontWeight: '200', fontSize: 12, paddingTop: 5 }}>
                            <Icon name='md-time' style={{ fontSize: 12, color: '#5d5d5d' }} /> {eventTime}
                          </Text>
                          <Text style={{ fontWeight: '100', fontSize: 12, color: '#757575', paddingTop: 5 }}><Icon type='SimpleLineIcons' name='location-pin' style={{ fontSize: 12, color: '#5d5d5d' }} /> {rowData.eventLocation}</Text>
                          <Text style={{ fontWeight: '800', fontSize: 22 }}></Text>
                          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "row", paddingTop: 5 }}>
                            <Text style={{ fontSize: 12, fontWeight: '100', paddingBottom: 5, paddingTop: 5, paddingLeft: 2, color: '#343d46' }}>
                              <Icon name='ios-people' style={{ fontSize: 25, color: '#f37735' }} /> {rowData.rsvpCount} people attending
                            </Text>
                          </View>
                          <TouchableHighlight
                            onPress={
                              () => this.props.navigation.navigate("EventDetails", { rowData, eventDay, eventTime })}
                          >
                            <Image
                              style={{ height: 200, width: null, borderRadius: 10, position: 'relative', resizeMode: 'stretch' }}
                              source={{ uri: rowData.eventImageURL }}
                            />
                          </TouchableHighlight>
                        </Body>
                      </Left>
                    </ListItem>
                  </List>
                </Content>
              )
            }}
          />
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container2: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: null,
    backgroundColor: '#FFFFFF'
  },
  backdrop: {
    height: 120,
  },
  backdropView: {
    paddingTop: 40,
    width: 400,
    backgroundColor: 'rgba(0,0,0,0)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listStyle: {
    backgroundColor: '#FFFFFF',
  },
  bigHeader: {
    fontSize: 18,
    fontWeight: '800',
    paddingTop: 10,
    paddingLeft: 15,
  },
  colorHeader: {
    fontSize: 18,
    fontWeight: '800',
    paddingTop: 10,
    paddingLeft: 15,
    color: '#008542',
  },
  containerStyle: {
    backgroundColor: '#FFFFFF',
  },
  buttonStyle: {
    fontSize: 12,
  },
  search: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 1,
  },
  searchbarColor: {
    backgroundColor: '#0039A6',
  },
  searchButton: {
    fontSize: 12,
    color: '#ffffff',
  },
  textInput: {
    height: 30,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginBottom: 5,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  hostStyle: {
    fontWeight: '800',
    fontSize: 14,
  },
  nameStyle: {
    fontWeight: '600',
    fontSize: 14,
  },
  eventNameStyle: {
    fontSize: 14,
    fontWeight: '800'
  },
  eventDescriptionStyle: {
    fontSize: 10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    marginTop: 5,
  },
  buttonText: {
    color: '#E98300',
    fontSize: 16,
    // borderWidth: 0.5,
    // borderRadius: 10,
    // padding: 10
  },
});
