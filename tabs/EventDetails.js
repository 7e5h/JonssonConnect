/**
 * JonssonConnect Event Details Page
 * https://github.com/mendoza-git/JonssonConnect
 * @flow
 */
 import React, { Component } from 'react';
 import { ActivityIndicator, AsyncStorage, Image, ListView, FlatList, StyleSheet, View } from 'react-native';
 import { TabNavigator, StackNavigator } from "react-navigation";
 import { Container, Header, Content, Card, Col, CardItem, Grid, Thumbnail, List, ListItem, Icon, Item, Input, Text, Title, Button, Left, Body, Right, Row, H1, H2, H3 } from 'native-base';
 import * as firebase from 'firebase';

 export default class EventDetails extends Component {

   constructor(props) {
     super(props);
     this.state = {
       isLoading: true,
       buttonColor: '#40E0D0'
     }
   }

   async componentDidMount() {
    this.setState({
      userID: await AsyncStorage.getItem('userID'),
      userEmail: await AsyncStorage.getItem('email'),
      isLoading: false
    });
  }

   static navigationOptions = {
     tabBarLabel: 'Events',
     tabBarIcon: ({ tintcolor }) => (
       <Image
        source={require('../images/eventsicon.png')}
        style={{width: 22, height: 22}}>
       </Image>
     )
   }

   render() {
     if (this.state.isLoading) {
       return (
         <View style={{flex: 1, paddingTop: 20}}>
           <ActivityIndicator />
         </View>
       );
     }
     return (
       <Container>
        <Content>
        <Image source={{uri: this.props.navigation.state.params.rowData.eventImageURL}} style={{ height: 200, width: null }}>
        </Image>
        <Card style={{flex: 0}}>
            <CardItem>
              <Body>
                <Text style={styles.nameStyle}>{this.props.navigation.state.params.rowData.eventTitle}</Text>
                <Text style={styles.hostStyle}>{this.props.navigation.state.params.rowData.hostedBy}</Text>
                <View style={{flexDirection: "row"}}>
                  <Text style={{ fontSize: 18, fontWeight: '100', color: '#3b5998', paddingLeft: 10, paddingRight: 125 }}><Icon name='ios-flame' style={{ fontSize: 18, color: '#f37735'}}/> Attending</Text>
                  <Text style={{ fontSize: 18, fontWeight: '100', color: '#3b5998', paddingLeft: 15 }}> <Icon name='ios-heart' style={{ fontSize: 18, color: '#d11141'}}/> Interested</Text>
                </View>
                <View style={{flexDirection: "row"}}>
                  <Text style={{ fontSize: 18, fontWeight: '100', color: '#3b5998', paddingLeft: 35, paddingRight: 225, paddingTop: 10 }}>{this.props.navigation.state.params.rowData.attendingCount}</Text>
                  <Text style={{ fontSize: 18, fontWeight: '100', color: '#3b5998', paddingLeft: 5, paddingTop: 10 }}>{this.props.navigation.state.params.rowData.interestedCount}</Text>
                </View>

              </Body>
            </CardItem>
            <CardItem>
              <Body>
              <Text style={{fontSize: 18, fontWeight: '800'}}>Details</Text>
              <Text style={{fontSize: 14, fontWeight: '100'}}></Text>
              <Text style={styles.descriptionStyle}>{this.props.navigation.state.params.rowData.eventDescription}</Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
              <Button full style={{ backgroundColor: this.state.buttonColor}}
              onPress={() => {
                this.setState({ buttonColor: '#137ed9' });
                var query = firebaseApp.database().ref('/Events').orderByChild('eventTitle').equalTo(this.props.navigation.state.params.rowData.eventTitle);
                query.once( 'value', data => {
                    data.forEach(userSnapshot => {
                        let key = userSnapshot.key;
                        var userID = this.state.userID.toString();
                        var userEmail = this.state.userEmail.toString();
                        this.eventsRef = firebaseApp.database().ref('Events/' + key).child('usersAttending').child(userID).set(userEmail);
                        this.attendingCountRef = firebaseApp.database().ref('Events/' + key).child('attendingCount');
                        var attendingCountRef = firebaseApp.database().ref('Events/' + key).child('attendingCount');
                          attendingCountRef.transaction(function (current_value) {
                            return (current_value || 0) + 1;
                        });
                    });
                });
              }}>
                <Text style={{ fontSize: 14, fontWeight: '500'}}><Icon name='ios-flame' style={{ fontSize: 14, color: '#ffffff'}}/> Attending</Text>
              </Button>
              <Text style={{fontSize: 14, fontWeight: '800'}}></Text>
              <Button full style={styles.InterestedbuttonStyle}
              onPress={() => {
                var query = firebaseApp.database().ref('/Events').orderByChild('eventTitle').equalTo(this.props.navigation.state.params.rowData.eventTitle);
                query.once( 'value', data => {
                    data.forEach(userSnapshot => {
                        let key = userSnapshot.key;
                        var userID = this.state.userID.toString();
                        var userEmail = this.state.userEmail.toString();
                        this.eventsRef = firebaseApp.database().ref('Events/' + key).child('usersInterested').child(userID).set(userEmail);
                        var interestedCountRef = firebaseApp.database().ref('Events/' + key).child('interestedCount');
                          interestedCountRef.transaction(function (current_value) {
                            return (current_value || 0) + 1;
                        });
                    });
                });
              }}>
                <Text style={{ fontSize: 14, fontWeight: '500'}}> <Icon name='ios-heart' style={{ fontSize: 14, color: '#ffffff'}}/> Interested</Text>
              </Button>

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
  InterestedbuttonStyle: {
     backgroundColor: '#5BC6E8',
     height: 40,
  },
  AttendingbuttonStyle: {
     backgroundColor: '#40E0D0',
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
