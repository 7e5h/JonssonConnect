/**
 * JonssonConnect Profile Page
 * Developed in part by Manu, Akshay, Vignesh, Ramya, & Jahnavi
 */

 import React, { Component } from 'react';
 import { ActivityIndicator, AsyncStorage, Image, ListView, FlatList, StyleSheet, TextInput, View } from 'react-native';
 import { createBottomTabNavigator, createStackNavigator } from "react-navigation";
 import { Container, Header, Content, Card, CardItem, Thumbnail, List, ListItem, Icon, Item, Input, Tab, Tabs, Text, Title, Button, Left, Body, Right, H1, H2, H3, } from 'native-base';
 import * as firebase from 'firebase';
 import firebaseApp from '../App';
 import rootRef from '../App';

 export default class Profile extends Component {
  constructor(props) {
     super(props);
     this.state = {
       isLoading: true
     }
   }

   async componentDidMount() {
     AsyncStorage.removeItem('LOGIN_TOKEN'),
     this.props.navigation.navigate('Login')
   }

   render() {
     if (this.state.isLoading) {
       return (
         <View style={{flex: 1, paddingTop: 20}}>
           <ActivityIndicator />
         </View>
       );
     }
   }
 }

 const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: '#F6F6F6',
  },
  cardStyle: {
    paddingTop: 30,
    alignItems: 'center',
  }
});
