/**
 This page is for when the user has whoosh bits and wants to exchange them for rewards
 */

import React, { Component } from 'react';

import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, AsyncStorage, ImageBackground, Image } from 'react-native';

import { Content, Form, Item, Input, Card, CardItem, Body, Icon, Text } from "native-base";
import CodeDisplay from './CodeDisplay';


export default class Redeem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            generateQRdata: '',
            redeemWhooshBits: false,
            whooshBitsValue: null,
            redeemPressed: false,
            userID: 'init',
            points: 0,
        };
    }

    async componentDidMount() {
        this.setState({
            userID: await AsyncStorage.getItem('userID'),
        });

    }

    hasWhitespace(str) {
        return (!str || str.length === 0 || /^\D*$/.test(str))
    }

    redeemPointsUpdater(w) {
        this.setState({
            whooshBitsValue: w.replace(/[^0-9]/g, '')
        })
    }

    validWhooshBitsRedeemValue(wbVal) {
        return (parseInt(wbVal).toString() !== '0') && (parseInt(wbVal) > 0) && (parseInt(this.state.whooshBitsValue) <= parseInt(wbVal))
    }


    displayQRCode() {
        if (this.state.whooshBitsValue !== null && this.hasWhitespace(this.state.whooshBitsValue) == false && this.validWhooshBitsRedeemValue(this.props.navigation.state.params.userPoints.toString())) {
            var woosh = this.state.whooshBitsValue;
            var ourUserID = this.state.userID;
            console.log("FROM REDEEM PAGE: " + woosh);
            console.log("FROM REDEEM PAGE USER ID: " + ourUserID);
            this.props.navigation.navigate('CodeDisplay', { woosh, ourUserID });
        }
        else if (this.state.whooshBitsValue == null) {
            Alert.alert(
                "Hmm...",
                "That doesn't seem right. Did you mean to enter some other value?\n\nYou have " + this.props.navigation.state.params.userPoints.toString() + " whoosh bits remaining!",
                [
                    { text: 'Got it!', onPress: () => console.log('User tried to scam us!') },
                ],
                { cancelable: false }
            )
            this.props.navigation.goBack(null);
        }
        else if (!this.validWhooshBitsRedeemValue(this.props.navigation.state.params.userPoints.toString())) {
            Alert.alert(
                "That's wayy too much!",
                'We noticed that you\'re trying to redeem more whoosh bits than available!\n\nYou can only redeem ' + this.props.navigation.state.params.userPoints.toString() + ' whoosh bits!',
                [
                    { text: 'Got it!', onPress: () => console.log('User tried to scam us!') },
                ],
                { cancelable: false }
            )
            this.props.navigation.goBack(null);
        }
        else {
            Alert.alert(
                'Typo Alert!',
                'We noticed that you made a typo. \n\nCould you please double check that you\'ve entered just numbers?',
                [
                    { text: 'Oops!', onPress: () => console.log('User tried entering invalid characters!') },
                ],
                { cancelable: false }
            )
        }

    }

    whooshBitsRedeemed = () => {
        // Alert.alert("Your QR code has been generated!");
        this.setState({
            isLoading: true,
            redeemPressed: true
        })
    }



    render() {
        return (
            <ScrollView style={styles.masterView}>
                <ImageBackground
                    style={{ width: null, height: 130 }}
                    blurRadius={0}
                    source={require('../images/image5.jpg')}>
                    <View style={{
                        paddingTop: 10, width: 400, backgroundColor: 'rgba(0,0,0,0)',
                        paddingLeft: 15, alignItems: 'center', justifyContent: 'center',
                    }} />
                </ImageBackground>
                <Content style={{ backgroundColor: '#FFFFFF' }}>
                    <Card>
                        <CardItem bordered style={{ borderLeftColor: '#0039A6', borderLeftWidth: 2 }}>
                            <Body>
                                <Text style={{ fontSize: 22, fontWeight: '800', color: '#C75B12' }}><Icon type='MaterialIcons' name='redeem' style={{ fontSize: 22, color: '#C75B12' }} /> {" "}Redeem Whoosh Bits</Text>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
                <View style={styles.headStyle}>
                    <Text style={styles.headerStyle}>To Redeem:</Text>
                </View>
                <View style={styles.infoStyle}>
                    <Text style={styles.bodyStyle}>1. Enter the number of whoosh bits you wish to redeem in the text box below.</Text>
                    <Text style={styles.bodyStyle}>2. Then, tap on the Whoosh Bits icon below to generate your personal QR code!</Text>
                    <Text style={styles.bodyStyle}>3. And you're done! That's it!</Text>
                    <Text style={styles.bodyStyle}>4. Just show this QR code to an attendant to approve your redeem points request!</Text>
                </View>
                <Form style={styles.formView}>
                {/* "FYI, you have " + this.props.navigation.state.params.userPoints.toString() + " Whoosh Bits remaining!" */}
                    <Item stackedLabel>
                        <Input placeholder= {"FYI, you have " + this.props.navigation.state.params.userPoints.toString() + " Whoosh Bits!"} keyboardType='numeric' onChangeText={(w) => { (this.redeemPointsUpdater(w)) }} name="whooshBits" />
                        {console.log('Whoosh Bits value entered: ' + this.state.whooshBitsValue)}
                    </Item>
                    <TouchableOpacity
                        onPress={() => this.displayQRCode()}
                        style={styles.button}
                    >
                        <Image
                            source={require('../images/wbicon.png')}
                            fadeDuration={0}
                            style={{ width: 120, height: 120, alignItems: 'center' }}
                        />
                        {/* <Text style={styles.buttonText}>{this.state.isLoading ? 'Redeeming...' : 'Tap to Redeem!'}</Text> */}
                    </TouchableOpacity>
                </Form>
            </ScrollView>
        );

    }
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
    },
    bodyStyle: {
        fontSize: 15,
    },
    infoStyle: {
        paddingHorizontal: 20,
    },

    headStyle: {
        paddingHorizontal: 10,
    }
});