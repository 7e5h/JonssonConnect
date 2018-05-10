/**
 * JonssonConnect Jobs Page
 * https://github.com/facebook/react-native
 * @flow
 */
 import React, { Component } from 'react';
 import { ActivityIndicator, Image, ListView, FlatList, StyleSheet, View, Linking, RefreshControl, TextInput, ImageBackground } from 'react-native';
 import { TabNavigator, StackNavigator } from "react-navigation";
 import { Container, Header, Content, Card, CardItem, Thumbnail, List, ListItem, Icon, Item, Input, Text, Title, Button, Left, Body, Right, H1, H2, H3 } from 'native-base';
 import * as firebase from 'firebase';

 export default class Jobs extends Component {

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
          dataSource: ds.cloneWithRows(responseJson.Jobs),
          data: responseJson.Jobs,
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
           dataSource: ds.cloneWithRows(responseJson.Jobs),
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
       Linking.openURL('https://www.utdallas.edu/career/cometcareers/')
     }
     >
     <Icon name='ios-globe-outline' />
      </Button>,
     tabBarLabel: 'Jobs',
     tabBarIcon: ({ tintcolor }) => (
      <Icon
      name='ios-briefcase-outline'
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
            source={{ uri: 'https://images.unsplash.com/photo-1501876991173-f9c47cd28268?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=11822fe6ab2de36ee07cd74486dbdaf4&auto=format&fit=crop&w=1906&q=80'}}
            >
              <View style={styles.backdropView}>
                <Text style={{ fontSize: 30, fontWeight: '200', paddingBottom: 5, paddingTop: 15, color: '#FFFFFF'}}>Jonsson|<Text style={{ fontSize: 30, fontWeight: '200', paddingBottom: 5, paddingTop: 15, color: '#FFFFFF'}}>Careers</Text></Text>
              </View>
          </ImageBackground>
        </View>
          <Content>
          <Card>
            <CardItem style={{ borderLeftColor: '#008542', borderLeftWidth: 2}}>
              <Body>
                <Text style={{ fontSize: 22, fontWeight: '800'}}><Icon name='md-trending-up' style={{ fontSize: 22, color: '#383838'}}/> Trending Jobs</Text>
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
                        <Thumbnail square source={{uri: rowData.companyImageURL}} />
                        <Body>
                          <Text onPress={() => this.props.navigation.navigate("JobsDetails", {rowData})} style={styles.positionTitleStyle}>
                            {rowData.positionTitle}
                          </Text>
                          <Text onPress={() => this.props.navigation.navigate("JobsDetails", {rowData})} style={styles.companyNameStyle}>
                            <Icon name='ios-at-outline' style={{ fontSize: 10}}/> {rowData.companyName}
                          </Text>
                          <Text onPress={() => this.props.navigation.navigate("JobsDetails", {rowData})} style={styles.jobLocationStyle}>
                            <Icon name='ios-pin-outline' style={{ fontSize: 10, color: '#878787'}}/> {rowData.jobLocation}
                          </Text>
                        </Body>
                      </Left>
                    </ListItem>
                  </List>
                </Content>
               )
             }}
           />
           <Image
             style={{ height: 150, width: null, borderRadius: 10, position: 'relative',}}
             source={require('../images/jcjobsbanner.png')}
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
     height: 100,
  },
  backdropView: {
     paddingTop: 10,
     width: 400,
     backgroundColor: 'rgba(0,0,0,0)',
     paddingLeft: 15,
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
    paddingBottom: 15,
  },
  colorHeader: {
    fontSize: 18,
    fontWeight: '800',
    paddingTop: 10,
    paddingLeft: 15,
    paddingBottom: 15,
    color: '#008542',
  },
  containerStyle: {
    backgroundColor: '#FFFFFF',
  },
  companyNameStyle: {
    fontWeight: '100',
    fontSize: 12,
    paddingTop: 3,
  },
  positionTitleStyle: {
     fontWeight: '500',
     fontSize: 14,
  },
  jobLocationStyle: {
     fontSize: 12,
     color: '#808080',
     paddingTop: 3,
     fontWeight: '100'
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
});
