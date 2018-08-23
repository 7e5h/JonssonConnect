/**
 * JonssonConnect Home Page
 * https://github.com/mendoza-git/JonssonConnect
 * @flow
 */
 import React, { Component } from 'react';
 import { Alert, ActivityIndicator, AsyncStorage, Image, ListView, Linking, ImageBackground, FlatList, RefreshControl, StyleSheet, TextInput, View, TouchableHighlight } from 'react-native';
 import { TabNavigator, StackNavigator } from "react-navigation";
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
     }
   }

   async componentDidMount() {
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
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson),
        }, function() {
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
         let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
         this.setState({
           isLoading: false,
           dataSource: ds.cloneWithRows(responseJson),
         }, function() {
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
       this.setState({refreshing: true});
       return fetch('https://jonssonconnect.firebaseio.com/Articles.json')
        .then((response) => response.json())
        .then((responseJson) => {
          let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          this.setState({
            isLoading: false,
            dataSource: ds.cloneWithRows(responseJson),
            refreshing: false,
          }, function() {
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

     static navigationOptions = ({ navigation }) => ({
       headerRight: <Button transparent onPress={() =>
         navigation.navigate('Profile')
       }><Icon name='ios-log-out' /></Button>,
       tabBarLabel: 'Home',
       tabBarIcon: ({ tintcolor }) => (
         <Image
          source={require('../images/temocicon.png')}
          style={{width: 32, height: 32}}>
         </Image>
       )
     });

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
                source={{ uri: 'https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'}}
                >
                  <View style={styles.backdropView}>
                    <Thumbnail large source={{uri: this.state.userPhoto.toString() }} />
                    <Text style={{ fontSize: 20, fontWeight: '800', paddingBottom: 5, paddingTop: 5, paddingLeft: 2, color: '#FFFFFF'}}>{this.state.firstName.toString()} {this.state.lastName.toString()}</Text>
                    <Text style={{ fontSize: 14, fontWeight: '300', paddingBottom: 5, paddingTop: 2, color: '#FFFFFF'}}> <Icon name='ios-pin' style={{ fontSize: 14, color: '#FFFFFF' }}/> {this.state.location.toString().replace(/{"name":"/g, '').replace(/"}/g, '')}</Text>
                    <Text style={{ fontSize: 14, fontWeight: '300', paddingBottom: 5, paddingTop: 2, color: '#FFFFFF'}}> <Icon name='ios-globe' style={{ fontSize: 14, color: '#FFFFFF' }}/> {this.state.industry.toString()}</Text>
                  </View>
              </ImageBackground>
            </View>
            <Content style={{ backgroundColor: '#FFFFFF'}}>
              <Card>
                <CardItem bordered style={{ borderLeftColor: '#0039A6', borderLeftWidth: 2}}>
                  <Body>
                    <Text style={{ fontSize: 22, fontWeight: '600', color: '#343d46'}}><Icon name='md-globe' style={{ fontSize: 22, color: '#0039A6'}}/> {dayofweek}, {month} {day}</Text>
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
                   <Text style={{fontSize: 14, fontWeight: '800'}}></Text>
                   <Text style={{color: rowData.articleColor, fontSize: 10, fontWeight: '100', paddingLeft: 15, paddingRight: 5, paddingTop: 10, }}>
                    <Icon name='ios-pricetag' style={{ fontSize: 10, color: rowData.articleColor}}/>  {rowData.articleType}
                   </Text>
                   <Text onPress={() => this.props.navigation.navigate("ArticleDetails", {rowData})} style={styles.nameStyle}>
                    {rowData.articleName}
                   </Text>
                   <Text style={styles.dateStyle}>
                    <Icon name='ios-clock-outline' style={{ fontSize: 12, color: '#878787'}}/> {monthNames[parseInt(rowData.postedOn.toString().substr(5, 5).substr(0, 2)) - 1]} {parseInt(rowData.postedOn.toString().substr(8, 2))}, {rowData.postedOn.toString().substr(0, 4)}</Text>
                 </Content>
                )
              }}
            />
            <Content>
              <Card bordered>
                <CardItem bordered>
                  <Body style={{ alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{ fontSize: 18, fontWeight: '800', alignItems: 'center', justifyContent: 'center'}}>Make a Gift</Text>
                    <Text style={{ fontSize: 12, fontWeight: '100', alignItems: 'center', justifyContent: 'center', paddingTop: 5}}>Please click the donate button to make on online donation.</Text>
                    <View style={{ alignItems: 'center', paddingTop: 5}}>
                    <Button rounded success onPress={ ()=>{ Linking.openURL('https://giving.utdallas.edu/ECS')}}>
                      <Text>Donate Now</Text>
                    </Button>
                    </View>
                  </Body>
                </CardItem>
              </Card>
            </Content>
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
