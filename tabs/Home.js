/**
 * JonssonConnect Home Page
 * Developed in part by Manu, Akshay, Vignesh, Ramya, & Jahnavi
 */

import React, { Component } from 'react';
import { Alert, ActivityIndicator, AsyncStorage, Image, ListView, Linking, ImageBackground, FlatList, RefreshControl, StyleSheet, TextInput, View, TouchableHighlight } from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from "react-navigation";
import { Container, Header, Content, Card, CardItem, Thumbnail, List, ListItem, Item, Icon, Input, Tab, Tabs, Text, Title, Button, Left, Body, Right, H1, H2, H3, } from 'native-base';
import * as firebase from 'firebase';
import firebaseApp from '../App';
import rootRef from '../App';

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      loadingFonts: true,
    }
  }

  studentUser = () =>
  {
    console.log('Current Student Pressed!')
    var fName = this.state.firstName
    var lName = this.state.lastName
    let userRef = firebase.database().ref('Users/' + this.state.userID + '/');
    console.log("USER ID FROM STUDENT USER FUNC IN HOME.JS: " + this.state.userID)
    userRef.update({
      classification: "student",
      userStatus: "approved",
      isAdmin: "false",
      numOfEvents: 0,
      points: 0,
      firstName: fName,
      lastName: lName
    }).then(function () {
      console.log('STUDENT CLASSIFICATION SUCCEEDED');
    })
    .catch(function (error) {
      console.log('STUDENT CLASSIFICATION FAILED' + error);
    });
  }

  alumniUser = () =>
  {
    console.log('Alumni Pressed!')
    var fName = this.state.firstName
    var lName = this.state.lastName
    let userRef = firebase.database().ref('Users/' + this.state.userID + "/");
    console.log("USER ID FROM ALUMNI USER FUNC IN HOME.JS: " + this.state.userID)
      userRef.update({
        classification: "student",
        userStatus: "waiting",
        isAdmin: "false",
        numOfEvents: 0,
        points: 0,
        firstName: fName,
        lastName: lName
      }).then(function () {
        console.log('ALUMNI CLASSIFICATION SUCCEEDED');
      })
        .catch(function (error) {
          console.log('ALUMNI CLASSIFICATION FAILED' + error);
        });
  }

      gotData = (data) => {
        var studentClassification = data.val()
        console.log("The classification is " + studentClassification)

        if(studentClassification === null)
        {
          Alert.alert(
            'I am a ...',
            'Please choose one of the options below. It will help us provide you with the most relevant news, events, & jobs!',
            [
              {text: 'Current Student', onPress: () => this.studentUser() },
              {text: 'Alumnus', onPress: () => this.alumniUser()},
            ],
            { cancelable: false }
          )
        }
        console.log("The classification is " + studentClassification)

    }

    errData = (err) => {
        console.log(err);
    }

  async componentDidMount() {

    this.setState({
      userID: await AsyncStorage.getItem('userID'),
    });

    var classificationRef = firebase.database().ref("Users/" + this.state.userID + "/classification/");
    classificationRef.on('value', this.gotData, this.errData);

    this.setState({
      firstName: await AsyncStorage.getItem('firstName'),
      lastName: await AsyncStorage.getItem('lastName'),
      userPhoto: await AsyncStorage.getItem('userPhoto'),
      headline: await AsyncStorage.getItem('headline'),
      location: await AsyncStorage.getItem('location'),
      industry: await AsyncStorage.getItem('industry'),
    });
    //return fetch('https://jonssonconnect.firebaseio.com/.json') // NOTE: As of Aug-2018, Firebase rules prevent this
    return fetch('https://jonssonconnect.firebaseio.com/Articles.json')
      //return fetch('/Users/mendoza/Downloads/articles.json')
      .then((response) => response.json())
      .then((responseJson) => {
        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson),
        }, function () {
        });
      })
      .catch((error) => {
        //console.error(error);
        this.setState({
          isLoading: false,
          networkFailed: true,
        })
      });
  }

  firstSearch() {
    return fetch('https://jonssonconnect.firebaseio.com/Articles.json')
      .then((response) => response.json())
      .then((responseJson) => {
        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson),
        }, function () {
        });
      })
      .catch((error) => {
        //console.error(error);
        this.setState({
          isLoading: false,
          networkFailed: true,
        })
      });
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    return fetch('https://jonssonconnect.firebaseio.com/Articles.json')
      .then((response) => response.json())
      .then((responseJson) => {
        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson),
          refreshing: false,
        }, function () {
        });
      })
      .catch((error) => {
        //console.error(error);
        this.setState({
          isLoading: false,
          networkFailed: true,
        })
      });
  }



  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
      "Saturday"
    ]

    const date = new Date()
    var month = monthNames[date.getMonth()]
    var year = date.getFullYear()
    var day = date.getDate()
    var dayofweek = days[date.getDay()]

    return (
      <Container style={styles.containerStyle}>
        <Content
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >
          <View style={styles.container2}>
            <ImageBackground
              style={styles.backdrop}
              blurRadius={0}
              source={require('../images/image2.jpg')}>
              <View style={styles.backdropView}>
                {/* <Text style={{ fontSize: 35, fontWeight: 'bold', paddingBottom: 5, paddingTop: 15, color: '#000000'}}>Jonsson|<Text style={{ fontSize: 35, fontWeight: 'bold', paddingBottom: 5, paddingTop: 15, color: '#c75b12'}}>Careers</Text></Text> */}
              </View>
            </ImageBackground>
          </View>
          <Content style={{ backgroundColor: '#FFFFFF' }}>
            <Card>
              <CardItem bordered style={{ borderLeftColor: '#0039A6', borderLeftWidth: 2}}>
                <Body>
                  <Text style={{ fontSize: 22, fontWeight: '800', color: '#C75B12' }}><Icon type='FontAwesome' name='newspaper-o' style={{ fontSize: 22, color: '#C75B12' }} /> {" "}Jonsson | News</Text>
                </Body>
              </CardItem>
            </Card>
          </Content>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) => {
              const { uri } = rowData;
              return (
                <Content style={{paddingBottom: 10}}>
                  <Text style={{ fontSize: 14, fontWeight: '800' }}></Text>
                  <Text style={{ color: rowData.articleColor, fontSize: 10, fontWeight: '100', paddingLeft: 15, paddingRight: 10, paddingTop: 10, paddingBottom: 10}}>
                    <Icon name='ios-pricetag' style={{ fontSize: 10, color: rowData.articleColor }} />  {rowData.articleType}
                  </Text>
                  <Text onPress={() => this.props.navigation.navigate("ArticleDetails", { rowData })} style={styles.nameStyle}>
                    {rowData.articleName}
                  </Text>
                  <Text style={styles.dateStyle}>
                    <Icon name='calendar' style={{ fontSize: 12, color: '#878787' }} /> {monthNames[parseInt(rowData.postedOn.toString().substr(5, 5).substr(0, 2)) - 1]} {parseInt(rowData.postedOn.toString().substr(8, 2))}, {rowData.postedOn.toString().substr(0, 4)}</Text>
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
  containerStyle: {
    backgroundColor: '#FFFFFF',
  },
  container2: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: null,
    backgroundColor: '#FFFFFF'
  },
  backdrop: {
    width: null,
    height: 180
  },
  backdropView: {
    paddingTop: 10,
    width: 400,
    backgroundColor: 'rgba(0,0,0,0)',
    paddingLeft: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostStyle: {
    fontWeight: '800',
    fontSize: 14,
  },
  seperator: {
    fontWeight: '100',
    color: '#D3D3D3',
    paddingLeft: 10,
  },
  nameStyle: {
    fontSize: 16,
    fontWeight: '400',
    paddingTop: 5,
    paddingLeft: 15,
    paddingRight: 5,
  },
  dateStyle: {
    fontSize: 10,
    fontWeight: '100',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 5,
    color: '#878787',
  },
  bigHeader: {
    fontSize: 24,
    fontWeight: '800',
    paddingTop: 10,
    paddingLeft: 15,
  },
  colorHeader: {
    fontSize: 24,
    fontWeight: '800',
    paddingTop: 10,
    paddingLeft: 15,
    color: '#C75B12',
  },
  jonssonHeader: {
    fontSize: 24,
    fontWeight: '800',
    paddingBottom: 20,
    paddingLeft: 10,
  },
  eventDescriptionStyle: {
    fontSize: 10,
  },
  typeStyle: {
    fontSize: 14,
    fontWeight: '800',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 5,
    color: '#0085c2',
  },
  summaryStyle: {
    fontSize: 18,
    fontWeight: '800',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 5,
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
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  searchbarColor: {
    backgroundColor: '#00A1DE',
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
});
