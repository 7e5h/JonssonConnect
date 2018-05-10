/**
 * JonssonConnect Events Page
 * https://github.com/mendoza-git/JonssonConnect
 * @flow
 */
 import React, { Component } from 'react';
 import { ActivityIndicator, AsyncStorage, Image, ListView, FlatList, StyleSheet, View, Linking, RefreshControl, TextInput, ImageBackground, TouchableHighlight } from 'react-native';
 import { TabNavigator, StackNavigator } from "react-navigation";
 import { Container, Header, Content, Card, CardItem, Thumbnail, List, ListItem, Icon, Item, Input, Text, Title, Button, Left, Body, Right, H1, H2, H3 } from 'native-base';
 import * as firebase from 'firebase';

 import firebaseApp from './EventDetails';
 import config from './EventDetails';

 export default class Events extends Component {

   constructor(props) {
     super(props);
     this.state = {
       isLoading: true,
       refreshing: false,
     }
   }

   componentDidMount() {
    return fetch('https://jonssonconnect.firebaseio.com/.json')
      .then((response) => response.json())
      .then((responseJson) => {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson.Events),
          data: responseJson.Events,
        }, function() {
			// do something with new state
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _onRefresh() {
    this.setState({refreshing: true});
    return fetch('https://jonssonconnect.firebaseio.com/.json')
     .then((response) => response.json())
     .then((responseJson) => {
       let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
       this.setState({
         isLoading: false,
         dataSource: ds.cloneWithRows(responseJson.Events),
         refreshing: false,
       }, function() {
         });
     })
     .catch((error) => {
       this.setState({
         isLoading: false,
         networkFailed: true,
       })
     });
  }

   static navigationOptions = {
     headerRight:
     <Button transparent onPress={() =>
       Linking.openURL('https://alumni.utdallas.edu/events')
     }
     >
     <Icon name='ios-calendar-outline' />
      </Button>,
     tabBarLabel: 'Events',
     tabBarIcon: ({ tintcolor }) => (
       <Icon
       name='ios-calendar-outline'
       color={ tintcolor} />
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
     const monthNames = ["January", "February", "March", "April", "May", "June",
       "July", "August", "September", "October", "November", "December"
   ];
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
            source={{ uri: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=8ccfcc13bfcdfca6f54a8e043ffbe075&auto=format&fit=crop&w=1650&q=80'}}
            >
              <View style={styles.backdropView}>
                <Text style={{ fontSize: 35, fontWeight: '200', color: '#FFFFFF'}}>Comet Calender</Text>
              </View>
          </ImageBackground>
        </View>
          <Content>
          <Card>
            <CardItem style={{ borderLeftColor: '#800000', borderLeftWidth: 2 }}>
              <Body>
                <Text style={{ fontSize: 22, fontWeight: '800'}}><Icon name='ios-flame' style={{ fontSize: 22, color: '#d64d4d'}}/> Find Events</Text>
              </Body>
            </CardItem>
          </Card>
		  </Content>
           <ListView
             dataSource={this.state.dataSource}
             renderRow={(rowData) => {
               const {uri} = rowData;
               return (
                 <Content>
                  <List style={{ backgroundColor: '#FFFFFF'}}>
                    <ListItem>
					<Left>
                      <Body>
                        <Text style={{fontWeight: '800', fontSize: 16}}>{rowData.eventTitle}</Text>
                        <Text style={{fontWeight: '200', fontSize: 12, paddingTop: 5}}>
                          <Icon name='ios-calendar-outline' style={{ fontSize: 12, color: '#5d5d5d'}}/> {monthNames[parseInt(rowData.eventDate.toString().substr(5, 5).substr(0, 2)) - 1]} {parseInt(rowData.eventDate.toString().substr(8, 2))}, {rowData.eventDate.toString().substr(0, 4)}
                        </Text>
                        <Text style={{fontWeight: '100', fontSize: 12, color: '#757575', paddingTop: 5}}><Icon name='ios-pin-outline' style={{ fontSize: 12, color: '#5d5d5d'}}/> {rowData.eventLocation}</Text>
                        <Text style={{fontWeight: '800', fontSize: 22}}></Text>
                        <TouchableHighlight
                          onPress={
                          () => this.props.navigation.navigate("EventDetails", {rowData})}
                          >
                          <Image
                            style={{ height: 200, width: null, borderRadius: 10, position: 'relative',}}
                            source={{ uri: rowData.eventImageURL}}
                          />
                        </TouchableHighlight>
                        <View style={{flexDirection: "row", paddingTop: 5}}>
                          <Text style={{ fontSize: 12, fontWeight: '100', paddingBottom: 5, paddingTop: 5, paddingLeft: 2, color: '#343d46'}}>
                            <Icon name='ios-flame' style={{ fontSize: 14, color: '#f37735'}}/> {rowData.attendingCount} people attending
                          </Text>
                          <Text style={{ fontSize: 12, fontWeight: '100', paddingBottom: 5, paddingTop: 5, paddingLeft: 2, color: '#343d46'}}>
                            <Icon name='ios-heart' style={{ fontSize: 14, color: '#d11141'}}/> {rowData.interestedCount} people interested
                          </Text>
                        </View>
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
      width: null,
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
});
