/**
 * JonssonConnect EventDetails Page
 * Developed in part by Manu, Akshay, Vignesh, Ramya, & Jahnavi
 */

import React, { Component } from 'react';
import { Alert, ActivityIndicator, AsyncStorage, Image, Linking, ListView, FlatList, StyleSheet, View } from 'react-native';
import { Container, Header, Content, Card, Col, CardItem, Grid, Thumbnail, List, ListItem, Icon, Item, Input, Text, Title, Button, Left, Body, Right, Row, H1, H2, H3 } from 'native-base';
import * as firebase from 'firebase';
import moment from 'moment';


export default class EventDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      buttonColor: '#40E0D0',
      rsvpState: false,
      volunteerState: false,
      event: this.props.navigation.state.params.event
    }
  }

  async componentDidMount() {
    //Set user ID and userEmail
    this.setState({
      userID: await AsyncStorage.getItem('userID'),
      userEmail: await AsyncStorage.getItem('email')
    });

    await this.updateEvent();

    this.setState({
      isLoading: false
    });
  }

  async updateEvent() {
    let query = firebase.database().ref('/Events/' + this.state.event.key);
    query.once('value').then(snapshot => {
      let eventData = snapshot.val();

      //Set the max number of RSVPs allowed
      this.setState({
        maxRsvps: eventData.maxRsvps,
        rsvpCount: eventData.rsvpCount
      });

      for(let id in eventData.usersRsvp) {
        if(this.state.userID === id) {
          this.setState({
            rsvpState: true
          });
        }
      }

      for(let id in eventData.usersVolunteer) {
        if(this.state.userID === id) {
          this.setState({
            volunteerState: true
          });
        }
      }
    }).catch(error => {
      console.log(error.message);
    });
  }

  // Checks state to see if user has already RSVP'd and returns "RSVP" or "Cancel RSVP" based on that.
  rsvpButton = () => {
    let event = this.state.event;

    if(!this.state.rsvpState && this.state.rsvpCount >= this.state.maxRsvps) {
      return (
        <Button full style={styles.fullRsvpButtonStyle} onPress={() => {
          Alert.alert('Event Is Full', 'Unfortunately, this event has reached maximum capacity.');
        }}>
          <Text>Event Is Full</Text>
        </Button>
      );
    } else {
      return (
        <Button full style={this.state.rsvpState? styles.cancelRsvpButtonStyle : styles.rsvpButtonStyle}
          onPress={() => {
            var query = firebase.database().ref('/Events').orderByChild('eventTitle').equalTo(event.eventTitle);
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

            let rsvpListRef = firebase.database().ref('/Users/' + this.state.userID + '/rsvpList/' + this.state.event.key);
            rsvpListRef.set(!this.state.rsvpState);

            if(!this.state.rsvpState && event.rsvpUrl) {
              Linking.openURL(event.rsvpUrl);
            }

            this.setState({ rsvpState: !this.state.rsvpState });
          }}>
          {
            this.state.rsvpState ?
                <Text style={{fontSize: 14, fontWeight: '500'}}> <Icon type="FontAwesome"  name='remove' style={{
                  fontSize: 14,
                  color: '#ffffff'
                }}/>{"  "} Cancel RSVP </Text>
                :
                <Text style={{fontSize: 14, fontWeight: '500'}}><Icon type="FontAwesome"  name='check' style={{
                  fontSize: 14,
                  color: '#ffffff'
                }}/>{"  "} RSVP </Text>
          }
        </Button>
      );
    }
  }

  volunteerButton = () => {
    let event = this.state.event;

    if(event.needsVolunteers) {
      return (
        <Button full style={this.state.volunteerState ? styles.cancelRsvpButtonStyle : styles.rsvpButtonStyle}
          onPress={() => {
            var query = firebase.database().ref('/Events').orderByChild('eventTitle').equalTo(event.eventTitle);
            query.once('value', data => {
              data.forEach(userSnapshot => {
                let key = userSnapshot.key;
                var userID = this.state.userID;
                var userEmail = this.state.userEmail;
                if(this.state.volunteerState){
                  firebase.database().ref('Events/' + key).child('usersVolunteer').child(userID).remove();
                } else {
                  firebase.database().ref('Events/' + key).child('usersVolunteer').child(userID).set(userEmail);
                }
              });
            });
            this.setState({ volunteerState: !this.state.volunteerState });

            if(!this.state.volunteerState && event.volunteerUrl) {
              Linking.openURL(event.volunteerUrl);
            }
          }}>
          {
            this.state.volunteerState ?
                <Text style={{fontSize: 14, fontWeight: '500'}}> <Icon name='ios-close-circle' style={{
                  fontSize: 14,
                  color: '#ffffff'
                }}/>{"  "} Cancel Volunteering </Text>
                :
                <Text style={{fontSize: 14, fontWeight: '500'}}><Icon name='ios-checkmark-circle' style={{
                  fontSize: 14,
                  color: '#ffffff'
                }}/>{"  "} Volunteer For Event </Text>
          }
        </Button>
      );
    } else {
      return null;
    }
  }

  openLinkButton = () =>{
    if(this.state.event.eventUrl) {
      return (
          <CardItem>
            <Body>
              <Button full style={styles.linkButtonStyle}
                      onPress={() => {
                        Linking.openURL(this.state.event.eventUrl)
                      }}>
                <Text style={{fontSize: 14, fontWeight: '500'}}>
                  <Icon type="FontAwesome" name='link' style={{fontSize: 20, color: '#FFFFFF'}}/>
                  {"  "} Open event URL </Text>
            </Button>
            </Body>
          </CardItem>
      )
    }
    else{
      return null
    }
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

    let event = this.props.navigation.state.params.event;

    return (
      <Container>
        <Content>
          {this.props.navigation.state.params.event.eventImageURL ? <Image source={{ uri: this.props.navigation.state.params.event.eventImageURL }} style={{ height: 200, width: null, resizeMode: 'cover' }} /> : null}
          <Card style={{ flex: 0 }}>
            <CardItem>
              <Body>
                <Text style={styles.nameStyle}>{event.eventTitle}</Text>
              </Body>
            </CardItem>
            <Text style={{ fontWeight: '200', fontSize: 12, paddingTop: 5, paddingLeft: 20 }}><Icon type='SimpleLineIcons' name='location-pin' style={{ fontSize: 12, color: '#5d5d5d' }} />{'  '}{event.eventLocation}</Text>
            <Text style={{ fontWeight: '200', fontSize: 12, paddingTop: 5, paddingLeft: 20 }}>
              <Icon name='ios-calendar' style={{ fontSize: 12, color: '#5d5d5d' }} /> {moment(event.eventDate).format('  ll')}
            </Text>
            <Text style={{ fontWeight: '200', fontSize: 12, paddingTop: 5, paddingLeft: 20 }}>
              <Icon name='md-time' style={{ fontSize: 12, color: '#5d5d5d' }} /> {moment(event.eventDate).format('  h:mm a')}
            </Text>
            <CardItem>
              <Body>
                <Text style={{ fontSize: 18, fontWeight: '800' }}>Details</Text>
                <Text style={{ fontSize: 14, fontWeight: '100' }}></Text>
                <Text style={styles.descriptionStyle}>{event.eventDescription}</Text>
              </Body>
            </CardItem>
            <CardItem>
              <View style={ styles.linkButtonStyle}>
                <Text style={{ fontSize: 14, color: '#FFFFFF' }}
                  onPress={(yourData) => this._handlePress(event.eventLocation)}>
                  <Icon type="FontAwesome" name='map' style={{ fontSize: 20, color: '#FFFFFF' }} />
                  {"  "} Open in maps
                </Text>
              </View>
            </CardItem>
            <this.openLinkButton />
            <CardItem>
              <Body>
                <this.rsvpButton />
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <this.volunteerButton />
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
  linkButtonStyle:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "#c75b12",
    height: 40,
  },
  rsvpButtonStyle: {
    backgroundColor: '#69BE28',
    height: 40,
  },
  cancelRsvpButtonStyle: {
    backgroundColor: '#bf281a',
    height: 40,
  },
  fullRsvpButtonStyle: {
    backgroundColor: 'lightgray',
    height: 40
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
  searchButton: {
    fontSize: 12,
    color: '#ffffff',
  },
});
