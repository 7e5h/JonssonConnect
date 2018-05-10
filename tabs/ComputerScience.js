/**
 * JonssonConnect Events Page
 * https://github.com/mendoza-git/JonssonConnect
 * @flow
 */
 import React, { Component } from 'react';
 import { ActivityIndicator, Image, ListView, FlatList, StyleSheet, View } from 'react-native';
 import { TabNavigator, StackNavigator } from "react-navigation";
 import { Container, Header, Content, Card, CardItem, Thumbnail, List, ListItem, Icon, Item, Input, Tab, Tabs, Text, Title, Button, Left, Body, Right, H1, H2, H3 } from 'native-base';
 import * as firebase from 'firebase';

 export default class ComputerScience extends Component {
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
          });
      })
      .catch((error) => {
        console.error(error);
      });
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
         <ListView
           dataSource={this.state.dataSource}
           renderRow={(rowData) => {
             const {uri} = rowData;
             return (
               <Card>
                <CardItem>
                  <Left>
                    <Thumbnail source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmfBRR5T0D2xN1IBPDFLC-c36Q04Rq-gc4sO-n7R5nsujLyASp7Q'}} />
                    <Body>
                    <Text style={styles.hostStyle}>
                      {rowData.postedBy}
                    </Text>
                    <Text style={styles.nameStyle}>
                      {rowData.articleNameName}
                    </Text>
                    </Body>
                  </Left>
                </CardItem>
                <CardItem cardBody>
                  <Image source={{uri: rowData.artcileImageURL}} style={{height: 100, width: null, flex: 1}}/>
                </CardItem>
                <Text style={{fontSize: 14, fontWeight: '800'}}></Text>
                <Text style={styles.summaryStyle}>
                  {rowData.articleSummary}
                </Text>
                <Text style={{fontSize: 14, fontWeight: '800'}}></Text>
                <Button full bordered light onPress={() => this.props.navigation.navigate("ArticleDetails", {rowData})}>
                  <Text style={{fontSize: 10, fontWeight: '400', color: '#104E8B'}}>View Article</Text>
                </Button>
              </Card>
             )
           }}
         />
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
   nameStyle: {
     fontWeight: '600',
     fontSize: 14,
    },
  eventNameStyle: {
    fontSize: 12,
  },
  eventDescriptionStyle: {
    fontSize: 10,
  },
  summaryStyle: {
    fontSize: 11,
    paddingTop: 4,
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
});
