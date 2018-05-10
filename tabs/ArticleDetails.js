/**
 * JonssonConnect Article Details Page
 * https://github.com/mendoza-git/JonssonConnect
 * @flow
 */
 import React, { Component } from 'react';
 import { ActivityIndicator, Image, ListView, FlatList, StyleSheet, View } from 'react-native';
 import { TabNavigator, StackNavigator } from "react-navigation";
 import { Container, Header, Content, Card, CardItem, Thumbnail, List, ListItem, Icon, Item, Input, Text, Title, Button, Left, Body, Right, H1, H2, H3 } from 'native-base';
 import * as firebase from 'firebase';

 export default class ArticleDetails extends Component {

   constructor(props) {
     super(props);
     this.state = {
       isLoading: true
     }
   }

   componentDidMount() {
    return fetch('https://jonssonconnect.firebaseio.com/.json')
      .then((response) => response.json())
      .then((responseJson) => {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson.Articles),
        }, function() {
          // do something with new state
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  static navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({ tintcolor }) => (
      <Image
       source={require('../images/temocicon.png')}
       style={{width: 32, height: 32}}>
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
       <Image source={{uri: this.props.navigation.state.params.rowData.articleImageURL}} style={{ height: 200, width: null }}></Image>
       <Card style={{flex: 0}}>
           <CardItem>
             <Body>
               <Text style={styles.articlenameStyle}>{this.props.navigation.state.params.rowData.articleName}</Text>
               <Text style={{fontSize: 14, fontWeight: '800'}}></Text>
               <Text style={{fontSize: 14, color: '#808080',}}><Icon name='ios-clock-outline' style={{ fontSize: 14}}/> Published on {new Date(this.props.navigation.state.params.rowData.postedOn).toLocaleDateString("en-US", { month:'short', day:'numeric', year:'numeric' })}</Text>
               <Text style={{fontSize: 12, fontWeight: '100', color: "#b6b6b6",}}>_____________________________________________________________</Text>
               <Text style={{fontSize: 12, fontWeight: '800'}}></Text>
               <Text style={{fontSize: 14, fontWeight: '800'}}> <Icon name='ios-paper-outline' style={{ fontSize: 14}}/> Article Highlights</Text>
               <Text style={{fontSize: 12, fontWeight: '100'}}></Text>
               <Text style={styles.contentStyle}>{this.props.navigation.state.params.rowData.articleContent}</Text>
             </Body>
           </CardItem>
           <CardItem>
           <Image source={{uri: 'http://ecs.utdallas.edu/aseegsw17/images/jonsson-school-logo.jpg'}} style={{ height: 200, width: null }}></Image>
           </CardItem>
         </Card>
       </Content>
       </Container>
     )
   }
 }

 const styles = StyleSheet.create({
  hostStyle: {
    fontWeight: '800',
    fontSize: 14,
   },
   articlenameStyle: {
     fontWeight: '800',
     fontSize: 24,
    },
    contentStyle: {
       fontWeight: '300',
       fontSize: 11,
    },
   nameStyle: {
      fontWeight: '600',
      fontSize: 16,
   },
   descriptionStyle: {
      fontWeight: '400',
      fontSize: 12,
   },
   hostStyle: {
     fontSize: 12,
     color: '#808080',
   },
  eventNameStyle: {
    fontSize: 12,
  },
  eventDescriptionStyle: {
    fontSize: 10,
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
    backgroundColor: '#0039A6',
  },
  searchButton: {
    fontSize: 12,
    color: '#ffffff',
  },
});
