/**
 * JonssonConnect Rewards Page
 * Developed in part by Manu, Akshay, Vignesh, Ramya, & Jahnavi
 */

import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, Linking, Dimensions, TouchableOpacity, ImageBackground, FlatList, ScrollView, ActivityIndicator, AsyncStorage, Image } from 'react-native';
import { Container, List, Right, CardItem } from 'native-base';
import * as firebase from 'firebase';
import moment from 'moment';

const EVENT_DATA_FUNCTION_URL = "https://us-central1-jonssonconnect.cloudfunctions.net/getEventData";

export default class Rewards extends Component {
  constructor(props) {
    super();

    this.state = {
      isLoading: true,
      pointsLoading: true,
      points: 0,
      numOfEvents: 0
    };
  }

  numOfEventsUpdate = (data) => {
    this.setState({
      numOfEvents: data.val()
    });
  };

  getPointsValues = () => {
    firebase.database().ref('Users/' + this.state.userID + '/points').once('value').then((snapshot) => {
      this.setState({
        points: snapshot.val(),
        pointsLoading: false
      });
    });
  }

  getEventCount = () => {
    firebase.database().ref('Users/' + this.state.userID + '/numOfEvents').once('value').then((snapshot) => {
      this.setState({
        numOfEvents: snapshot.val()
      });
    });
  }

  getEventData = () => {
    let url = EVENT_DATA_FUNCTION_URL;
    let separator = "?"

    firebase.database().ref('Users/' + this.state.userID + '/attendedList').once('value').then(snapshot => {
      snapshot.forEach(eventSnapshot => {
        url += separator + "events=" + eventSnapshot.key;
        separator = "&";
      });

      fetch(url).then(resp => resp.json()).then(data => {
        data.sort((x, y) => {
          //Sort the list in descending order by date
          if(x.eventDate > y.eventDate) {
            return -1;
          } else if(x.eventDate < y.eventDate) {
            return 1;
          } else {
            return 0;
          }
        });

        this.setState({
          attendedEvents: data,
          isLoading: false
        });
      });
    })
  }

  async componentDidMount() {
    this.setState({
      userID: await AsyncStorage.getItem('userID')
    });

    this.getPointsValues();
    this.getEventCount();
    this.getEventData();
  }

  onRedeemPressed = () => {
    var userPoints = this.state.points;
    this.props.navigation.navigate('Redeem', {userPoints });
  }

  renderEvent = ({item}) => {
    return (
      <View style={{ flex: 1, borderColor: 'black', borderWidth: 1, padding: 10, borderRadius: 5, marginVertical: 5 }}>
        <Text style={styles.eventTitle}>{item.eventTitle}</Text>
        <Text>Whoosh Bits Earned: {item.whooshBits}</Text>
      </View>
    );
  }

  renderEventList = () => {
    if(this.state.attendedEvents && this.state.attendedEvents.length > 0) {
      return (
        <FlatList
          data={this.state.attendedEvents}
          renderItem={this.renderEvent}
          keyExtractor={(item, index) => "event" + index}
        />
      );
    } else {
      return (
        <Text style={{ color: 'gray' }}>You have not attended any events yet.</Text>
      );
    }
  }

  render() {
    if (this.state.isLoading || this.state.pointsLoading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <ScrollView>
        <View>
          <ImageBackground blurRadius={0} source={require('../images/image6.jpg')} style={styles.imageBackground} />
          <View style={{ paddingHorizontal: 20 }}>
            <View style={styles.displayInfo}>
              <View style={styles.info}>
                <Text style={styles.infoNumber}>{this.state.numOfEvents}</Text>
                <Text style={styles.infoLabel}>Events Attended</Text>
              </View>

              <View style={styles.info}>
                <Text style={styles.infoNumber}>{this.state.points}</Text>
                <Text style={styles.infoLabel}>Whoosh Bits</Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Button onPress={this.onRedeemPressed} title="Redeem Whosh Bits" color="#008542" />
            </View>

            <View style={styles.eventHistoryContainer}>
              <Text style={styles.eventHistoryTitle}>Recent Event History</Text>
              <this.renderEventList />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  imageBackground: {
    width: null,
    height: 130
  },
  displayInfo: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderColor: '#008542'
  },
  buttonContainer: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: 'center'
  },
  info: {
    width: '50%'
  },
  infoNumber: {
    textAlign: 'center',
    fontSize: 17,
    paddingVertical: 20,
    color: '#008542',
    fontWeight: 'bold'
  },
  infoLabel: {
    textAlign: 'center',
    fontSize: 17,
    color: '#008542',
    fontWeight: 'bold',
    paddingBottom: 20
  },
  eventHistoryTitle: {
    fontSize: 24,
    color: '#008542',
    fontWeight: 'bold'
  },
  eventTitle: {
    fontSize: 17,
    color: '#008542',
    fontWeight: 'bold'
  },
  eventHistoryContainer: {
    paddingVertical: 20,
    flex: 1
  }
});
