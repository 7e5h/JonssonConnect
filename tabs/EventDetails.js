/**
 * JonssonConnect EventDetails Page
 * Developed in part by Manu, Akshay, Vignesh, Ramya, & Jahnavi
 */

import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, Image, ListView, FlatList, StyleSheet, View } from 'react-native';
import { Container, Header, Content, Card, Col, CardItem, Grid, Thumbnail, List, ListItem, Icon, Item, Input, Text, Title, Button, Left, Body, Right, Row, H1, H2, H3 } from 'native-base';
import * as firebase from 'firebase';
import { Linking } from 'react-native';
import moment from 'moment';


export default class EventDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      buttonColor: '#40E0D0',
      rsvpState: false,

    }
  }

  async componentDidMount() {
    this.setState({
      userID: await AsyncStorage.getItem('userID'),
      userEmail: await AsyncStorage.getItem('email'),
      isLoading: false
    });

    let eventKey;
    var query = firebase.database().ref('/Events').orderByChild('eventTitle').equalTo(this.props.navigation.state.params.event.eventTitle);
    query.once('value', data => {
      data.forEach(userSnapshot => {
        var eventData = userSnapshot.val();
        eventKey = userSnapshot.key;
        var stringifiedEvent = JSON.stringify(eventData);
        var parsedEvent = JSON.parse(stringifiedEvent);

        var usersRsvp = parsedEvent.usersRsvp;
        for (var userId in usersRsvp) {
          if (userId === this.state.userID) {
            this.setState({ rsvpState: true });
          }
        }
      });
    });
  }


  // Checks state to see if user has already RSVP'd and returns "RSVP" or "Cancel RSVP" based on that.
  rsvpButton = () => {
      return (
        <Button full style={this.state.rsvpState? styles.cancelRsvpButtonStyle : styles.rsvpButtonStyle}
          onPress={() => {
            var query = firebase.database().ref('/Events').orderByChild('eventTitle').equalTo(this.props.navigation.state.params.event.eventTitle);
            query.once('value', data => {
              data.forEach(userSnapshot => {
                let key = userSnapshot.key;
                var userID = this.state.userID;
                var userEmail = this.state.userEmail;
                if(this.state.rsvpState){
                  firebase.database().ref('Events/' + key).child('usersRsvp').child(userID).remove();
                  var interestedCountRef = firebase.database().ref('Events/' + key).child('rsvpCount');
                  interestedCountRef.transaction(function (current_value) {
                    return (current_value || 0) - 1;
                  });
                }
                else{
                  firebase.database().ref('Events/' + key).child('usersRsvp').child(userID).set(userEmail);
                  var interestedCountRef = firebase.database().ref('Events/' + key).child('rsvpCount');
                  interestedCountRef.transaction(function (current_value) {
                    return (current_value || 0) + 1;
                  });
                }
              });
            });
            this.setState({ rsvpState: !this.state.rsvpState });
          }}>
          {
            this.state.rsvpState ?
                <Text style={{fontSize: 14, fontWeight: '500'}}> <Icon name='ios-close-circle' style={{
                  fontSize: 14,
                  color: '#ffffff'
                }}/>{"  "} Cancel RSVP </Text>
                :
                <Text style={{fontSize: 14, fontWeight: '500'}}><Icon name='ios-checkmark-circle' style={{
                  fontSize: 14,
                  color: '#ffffff'
                }}/>{"  "} RSVP </Text>
          }
        </Button>
      )
  }
  // This is the method for map url
  _handlePress = (url) => {
    console.log("THE URL IS:" + url)
    Linking.openURL("https://www.google.com/maps/search/?api=1&query=" + url);
  };


  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <Container>
        <Content>
          {this.props.navigation.state.params.event.eventImageURL ? <Image source={{ uri: this.props.navigation.state.params.event.eventImageURL }} style={{ height: 200, width: null, resizeMode: 'contain' }} /> : null}
          <Card style={{ flex: 0 }}>
            <CardItem>
              <Body>
                <Text style={styles.nameStyle}>{this.props.navigation.state.params.event.eventTitle}</Text>
              </Body>
            </CardItem>
            <Text style={{ fontWeight: '200', fontSize: 12, paddingTop: 5, paddingLeft: 20 }}><Icon type='SimpleLineIcons' name='location-pin' style={{ fontSize: 12, color: '#5d5d5d' }} />{'  '}{this.props.navigation.state.params.event.eventLocation}</Text>
            <Text style={{ fontWeight: '200', fontSize: 12, paddingTop: 5, paddingLeft: 20 }}>
              <Icon name='ios-calendar' style={{ fontSize: 12, color: '#5d5d5d' }} /> {moment(this.props.navigation.state.params.event.eventDate).format('  ll')}
            </Text>
            <Text style={{ fontWeight: '200', fontSize: 12, paddingTop: 5, paddingLeft: 20 }}>
              <Icon name='md-time' style={{ fontSize: 12, color: '#5d5d5d' }} /> {moment(this.props.navigation.state.params.event.eventDate).format('  h:mm a')}
            </Text>
            <CardItem>
              <Body>
                <Text style={{ fontSize: 18, fontWeight: '800' }}>Details</Text>
                <Text style={{ fontSize: 14, fontWeight: '100' }}></Text>
                <Text style={styles.descriptionStyle}>{this.props.navigation.state.params.event.eventDescription}</Text>
              </Body>
            </CardItem>
            <CardItem>
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 8, backgroundColor: "#c75b12" }}>
                <Text style={{ fontWeight: "bold", fontSize: 14, color: '#FFFFFF' }}
                  onPress={(yourData) => this._handlePress(this.props.navigation.state.params.event.eventLocation)}>
                  <Icon type="Entypo" name='location' style={{ fontSize: 20, color: '#FFFFFF' }} />
                  {"  "} OPEN IN MAPS!
            </Text>
              </View>
            </CardItem>
            <CardItem>
              <Body>
                <this.rsvpButton />
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    )


  }
}

const styles = StyleSheet.create({
  nameStyle: {
    fontWeight: '800',
    fontSize: 20,
  },
  rsvpButtonStyle: {
    backgroundColor: '#69BE28',
    height: 40,
  },
  cancelRsvpButtonStyle: {
    backgroundColor: '#bf281a',
    height: 40,
  },
  descriptionStyle: {
    fontWeight: '100',
    fontSize: 12,
  },
  hostStyle: {
    fontSize: 12,
    color: '#808080',
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
    backgroundColor: '#0039A6',
  },
  searchButton: {
    fontSize: 12,
    color: '#ffffff',
  },
});
