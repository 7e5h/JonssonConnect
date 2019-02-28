/**
 * JonssonConnect EventsCalendar Page
 * Developed in part by Manu, Akshay, Vignesh, Ramya, & Jahnavi
 */

import { Calendar } from 'react-native-calendars';
import React, { Component } from 'react';
import {ScrollView, AsyncStorage, FlatList, Text, TouchableOpacity, Image, View,StyleSheet} from 'react-native';
import * as firebase from 'firebase';

//The below 3 imports were used to fix the iterator error
import 'core-js/es6/map'
import 'core-js/es6/symbol'
import 'core-js/fn/symbol/iterator'
import moment from "moment";
import {Body, Card, CardItem, Content, Icon, Left, List, ListItem} from "native-base";

const dot_color = { color: 'white' };

export default class EventsCalendar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userClassification: '',
            markedDates: {},
            eventDates: [],
            selectedDayEvents: [],
            eventData:[],
            currentSelectedDate:''
        }
    }

    async componentWillMount() {

        this.setState({
            userID: await AsyncStorage.getItem('userID'),
            userClassification: await AsyncStorage.getItem('userClassification')
        });

        this.updateClassification();
        this.loadEvents();
    }

    loadEvents = () => {
        let eventsRef = firebase.database().ref("Events/").orderByChild("eventClassification");
        eventsRef.on('value', this.eventsLoaded, this.printError);
    }

    updateClassification = () => {
        let userClassificationRef = firebase.database().ref("Users/" + this.state.userID + "/classification/");
        userClassificationRef.on('value', this.loadedClassification, this.printError);
    }

    eventsLoaded = (data) => {

        let userType = this.state.userClassification;
        if (userType !== "student" && userType !== "alumni" && userType !== "admin") {
            console.log("EventsCalendar: User classification type not recognized");
            return;
        }

        let eventData = data.val();

        let currentDate  = moment().toISOString(true).slice(0, 10);
        let dates = [];
        let validEvents = [];
        let earliestDate = ''
        for (let key in eventData) {
            let dateOfEvent = eventData[key]['modifiedDate'];
            let eventClassification = eventData[key]['eventClassification'];

            // check if event has already passed
            if (moment(dateOfEvent).isBefore(currentDate)) { continue }

            // Only include dates that the user should see here
            if (userType === 'admin' || eventClassification === 'both' || eventClassification === userType) {

                if (earliestDate === '' || moment(dateOfEvent).isBefore(earliestDate)){
                    earliestDate = dateOfEvent
                }
                dates.push(dateOfEvent);
                validEvents.push(eventData[key])
            }
        }

        this.setState({eventData: validEvents});
        this.setState({eventDates: dates});
        this.setState({currentSelectedDate:earliestDate},()=>this.updateSelectedDayEvents())
        this.setState({markedDates: this.getMarkedDatesForCalendar(dates)});
    }

    loadedClassification = (newClassification) => {

        let value = newClassification.val();

        if (value === null) {
            console.log("EventsCalendar: newClassification === null");
            return;
        }

        AsyncStorage.setItem('userClassification', value);
        this.setState({ userClassification: value });
        this.loadEvents();
    }

    printError = (err) => {
        console.log(err);
    }

    updateSelectedDayEvents(){
        let selectedDayEvents = []
        var length = this.state.eventData.length
        for (let i = 0;i<length;i++){
            if(this.state.eventData[i].modifiedDate === this.state.currentSelectedDate)
                selectedDayEvents.push(this.state.eventData[i])
        }
        this.setState({selectedDayEvents: selectedDayEvents});
    }


    getMarkedDatesForCalendar = (arr) => {
        arr.sort()
        let dotColorArray = [dot_color]
        let obj = arr.reduce((c, v) => Object.assign(c, { [v]: { dots: dotColorArray, selected: true, selectedColor: '#c75b12'} }), {});
        return obj
    }

    handleDayClick = (day) => {
        this.setState({currentSelectedDate:day.dateString},()=>this.updateSelectedDayEvents())
    }



    render() {
        let currentDate  = moment().toISOString(true).slice(0, 10);
        return (
            <ScrollView>
                <Calendar
                    // Max amount of months allowed to scroll to the past. Default = 50
                    pastScrollRange={0}
                    // Max amount of months allowed to scroll to the future. Default = 50
                    futureScrollRange={6}
                    //Selected current date
                    current={this.state.currentSelectedDate}
                    // Enable or disable scrolling of calendar list
                    scrollEnabled={true}
                    // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                    minDate={currentDate}
                    // By default, agenda dates are marked if they have at least one item, but you can override this if needed
                    markedDates={this.state.markedDates}
                    //This attribute enables multiple dots on a single date
                    markingType={'multi-dot'}
                    // callback that gets called on day press
                    onDayPress={(day) => {
                        this.handleDayClick(day)
                    }}
                />
                <Content>
                    <Card>
                        <CardItem>
                            <Body style={{flex:1,flexDirection: 'row', alignItems: 'center',}}>
                            <Text style={{ color: '#c75b12', fontSize: 22, fontWeight: '800'}}><Icon name='calendar-o' type='FontAwesome' style={{ fontSize: 22, color: '#c75b12'}}/> {" "}{moment(this.state.currentSelectedDate).format('MMMM Do, YYYY')}</Text>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
                <List>
                    <FlatList
                        data={this.state.selectedDayEvents}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => {this.navigateToEventPage(item)}} style={styles.event} >
                                <Text style={{ fontWeight: '800', fontSize: 16, flex:1, paddingBottom:3}}>{item.eventTitle}</Text>
                                <View style={styles.eventData}>
                                    <View style = {styles.leftItems}>
                                        <Text style={{ fontWeight: '100', fontSize: 12, color: '#757575', paddingTop: 5 }}>
                                            <Icon type='SimpleLineIcons' name='location-pin' style={{ fontSize: 12, color: '#5d5d5d' }} /> {item.eventLocation}
                                        </Text>
                                        <Text style={{ fontSize: 12, fontWeight: '100', paddingBottom: 5, paddingTop: 5, paddingLeft: 2, color: '#343d46' }}>
                                            {item.rsvpCount? item.rsvpCount:0} {item.rsvpCount === 1?'person':'people'} attending{'   '}
                                            <Icon name='ios-flame' style={{ fontSize: 14, color: '#f37735' }} />
                                        </Text>
                                    </View>
                                    <View style={styles.rightItems}>
                                        <Text style={{ fontWeight: '200', fontSize: 12, paddingTop: 5 ,textAlign: 'right'}}>
                                            <Icon name='clock' style={{ fontSize: 12, color: '#5d5d5d', paddingRight:2}} />
                                            {moment(item.eventDate).format('  h:mm a')}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </List>
            </ScrollView>
        )
    }

    navigateToEventPage(passedEvent) {
        this.props.navigation.navigate("EventDetails", {event:passedEvent});
    };

}

const styles = StyleSheet.create({
    event:{
        padding:10,
        flexDirection: 'column',
    },
    leftItems: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex:1,

    },
    rightItems: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flex:1,
    },
    eventData: {
        flexDirection: 'row',
        flex:1,
    }
});