import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Button, TouchableOpacity, Alert, AsyncStorage, ImageBackground, Image } from 'react-native';
import { Container, Header, Content, Accordion, Form, Item, Input, Label, Card, CardItem, Body, Icon, Text } from "native-base";
import { QRCode } from 'react-native-custom-qr-codes';



export default class CodeDisplay extends React.Component {
    
render() {

  console.log('USER ID from CodeDisplay.js is ' + this.props.navigation.state.params.ourUserID.toString());
  return(

    <ScrollView style={styles.masterView}>
            <ImageBackground
              style={{width: null, height: 130}}
              blurRadius={0}
              source={require('../images/image3.jpg')}>
              <View style={{ paddingTop: 10, width: 400, backgroundColor: 'rgba(0,0,0,0)',
               paddingLeft: 15,  alignItems: 'center', justifyContent: 'center',}}/>
        </ImageBackground>
        <Content style={{ backgroundColor: '#FFFFFF' }}>
            <Card>
              <CardItem bordered style={{ borderLeftColor: '#0039A6', borderLeftWidth: 2}}>
                <Body>
                  <Text style={{ fontSize: 22, fontWeight: '800', color: '#C75B12' }}><Icon type='MaterialCommunityIcons' name='qrcode' style={{ fontSize: 22, color: '#C75B12' }} /> {" "}Your Personalized QR Code</Text>
                </Body>
              </CardItem>
            </Card>
          </Content>
                {/* <View style={styles.headStyle}>
                <Text style = {styles.headerStyle}>Your Personalized QR Code!</Text>
                </View> */}
                <View style={styles.infoStyle}>
                    <Text style = {styles.bodyStyle}>{"\n\n\n"}Show this QR code to an attendant to approve your redeem request! {"\n"}</Text>
                    <Text style = {styles.bodyStyle3}>{"\n\n"}USER ID: {this.props.navigation.state.params.ourUserID.toString() + "\n\n\n"}</Text>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <QRCode
                  content = {'app,' + this.props.navigation.state.params.ourUserID.toString() + ',' + this.props.navigation.state.params.woosh.toString()}
                  //ecl = 'M'
                  outerEyeStyle='circle'
                  //innerEyeStyle='diamond'
                  //backgroundColor = '#c75b12'
                  color = '#c75b12'
                  //logo={require('../images/temoc_icon.png')}
                  //logoSize='12'
                  />
                </View>
                </ScrollView>
  )}
}

const styles = StyleSheet.create({
  container: {
      justifyContent: 'center',
      marginTop: 50,
      padding: 20,
  },
  button: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      marginTop: 30,
  },
  buttonText: {
      color: '#E98300',
      fontSize: 16,
      fontWeight: '200'
  },
  masterView: {
      backgroundColor: '#FFFFFF',
  },
  formView: {
      paddingTop: 40,
  },
  headerStyle: {
      paddingVertical: 20,
      fontSize: 20,
      textAlign: 'center',
  },
  bodyStyle: {
      fontSize: 15,
      textAlign: 'center',
  },
  bodyStyle3: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold'
},
  infoStyle: {
      textAlign: "center",
      paddingHorizontal: 20,
  },

  headStyle: {
      textAlign: "center",
      paddingHorizontal: 10,
  }
});