/**
 * JonssonConnect Rewards Page
 * Developed in part by Manu, Akshay, Vignesh, Ramya, & Jahnavi
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, Linking, Dimensions, TouchableOpacity, ImageBackground, ListView, ScrollView, ActivityIndicator, AsyncStorage, Image } from 'react-native';
import { Container, List, Right, CardItem } from 'native-base';
import * as firebase from 'firebase';

import firebaseApp from './EventDetails';
import config from './EventDetails'
import moment from 'moment';

export default class Rewards extends Component {

    constructor(props) {
        super();
        const ev = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            isLoading: true,
            pointsLoading: true,
            dataSource: ev.cloneWithRows([]),
            points: 0,
            numOfEvents: 0
        };
        this.renderRow = this.renderRow.bind(this)
    }

    numOfEventsUpdate = (data) => {
        var eventsAttendedValue = data.val();
        console.log("REWARDS PAGE # EVENTS ATTENDED: " + eventsAttendedValue);
        this.state.numOfEvents = eventsAttendedValue
    }

    getPointsValues(){
        fetch('https://jonssonconnect.firebaseio.com/Users/' + this.state.userID + '/points.json')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    points: responseJson,
                    pointsLoading: false,
                });
            })
            .catch((error) => {
                console.error("AN ERROR OCCURED WHEN FETCHING points FROM FIREBASE: " + err);
            });
    }
    getEventCount(){
        fetch('https://jonssonconnect.firebaseio.com/Users/' + this.state.userID + '/numOfEvents.json')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    numOfEvents: responseJson
                });
            })
            .catch((error) => {
                console.error("AN ERROR OCCURED WHEN FETCHING numOfEvents FROM FIREBASE: " + error);
            });
    }

    async componentDidMount() {
        this.setState({
            userID: await AsyncStorage.getItem('userID'),
            isLoading: false
        });
        this.getPointsValues()
        this.getEventCount()
    }

    onRedeemPressed = () => {
        var userPoints = this.state.points;
        this.props.navigation.navigate('Redeem', {userPoints });
    }

    utcToLocal = (time) => {
        var localTime = moment(time).local().format("MMMM Do YYYY, h:mm a");
        return localTime;
    }

    render() {

        if (this.state.isLoading || this.state.pointsLoading) {
            return (
                <View style={{ flex: 1, paddingTop: 20 }}>
                    <ActivityIndicator />
                </View>
            );
        }
        console.log('this is user id from rewards component: ' + this.state.userID);

        return (
            <ScrollView>
                <ImageBackground
                    style={{
                        width: null,
                        height: 130
                    }}
                    blurRadius={0}
                    source={require('../images/image6.jpg')}>
                    <View style={{
                        paddingTop: 10,
                        width: 400,
                        backgroundColor: 'rgba(0,0,0,0)',
                        paddingLeft: 15,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }} />
                </ImageBackground>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    borderColor: '#008542',
                }}>
                    <View style={{
                        width: '50%',
                        height: '100%',
                        backgroundColor: 'white'
                    }}>
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 17,
                            paddingVertical: 20,
                            color: '#008542',
                            fontWeight: 'bold'
                        }}> {this.state.numOfEvents} {"\n"}{"\n"}
                            Events Attended </Text>
                    </View>
                    <View style={{
                        width: '50%',
                        height: '100%',
                        backgroundColor: 'white'
                    }}>
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 17,
                            paddingVertical: 20,
                            color: '#008542',
                            fontWeight: 'bold'
                        }}>
                            {this.state.points} {"\n"}{"\n"}
                            Whoosh Bits Earned</Text>
                    </View>
                </View>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    borderColor: '#008542',
                }}>
                    <TouchableOpacity onPress={this.onRedeemPressed}
                        style={{
                            width: '100%',
                            backgroundColor: 'white',
                        }}>
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 20,
                            paddingTop: 20,
                            color: '#c75b12',
                            fontWeight: 'bold'
                        }}>
                            Tap here to
                        </Text>
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 30,
                            paddingBottom: 20,
                            color: '#c75b12',
                            fontWeight: 'bold'
                        }}>
                            Redeem Whoosh Bits!
                        </Text>
                    </TouchableOpacity>
                    <View style={{
                        height: '100%',
                    }}>
                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow={this.renderRow.bind(this)} />
                    </View>
                </View>
            </ScrollView>
        ); //return

    } //Render

    renderRow(events) {
        return (
            <View style={
                {
                    display: "flex",
                    flexDirection: "row",
                    borderBottomWidth: 0,
                    borderColor: '#d3d3d3',
                    width: '100%',
                    backgroundColor: 'white',
                    paddingTop: 15,
                    paddingBottom: 15,
                    paddingLeft: 8
                }
            }>
                <ScrollView>
                    <CardItem >
                        <View style={{
                            width: '100%',
                            flexGrow: 1
                        }}>
                            <Text style={{
                                color: '#008542'
                            }}>
                                {events.eventTitle}
                            </Text>
                            <View style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexDirection: 'row'
                            }}>
                                <Text style={{
                                    color: '#008542'
                                }}>
                                    {this.utcToLocal(events.eventDate.toString())}
                                </Text>
                            </View>
                            <View style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                flexDirection: 'row'
                            }}>
                                <Text style={{
                                    color: '#008542',
                                    paddingBottom: 5,
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                }}>
                                    {events.whooshBits + '\t'}

                                </Text>
                                <Image
                                    source={require('../images/wbicon.png')}
                                    fadeDuration={0}
                                    style={{
                                        width: 20,
                                        height: 20,
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{
                            marginTop: 15,
                            paddingLeft: 300,
                            flex: 0,
                            width: '100%'
                        }}>
                            <Text style={{
                                color: '#008542',
                                fontWeight: 'bold',
                                fontSize: 16
                            }}>
                                {events.attandingCount}
                            </Text>
                        </View>
                    </CardItem>
                </ScrollView>
            </View>
        );
    }
}