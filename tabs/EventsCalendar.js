/**
 * JonssonConnect EventsCalendar Page
 * Developed in part by Manu, Akshay, Vignesh, Ramya, & Jahnavi
 */

import { CalendarList } from 'react-native-calendars';
import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import * as firebase from 'firebase';

//The below 3 imports were used to fix the iterator error
import 'core-js/es6/map'
import 'core-js/es6/symbol'
import 'core-js/fn/symbol/iterator'
import moment from "moment";

const dot_color = { color: 'white' };

export default class EventsCalendar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userClassification: '',
            markedDates: [],
            eventDates: []
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
        let events = [];
        for (let key in eventData) {
            let dateOfEvent = eventData[key]['modifiedDate'];
            let eventClassification = eventData[key]['eventClassification'];

            // check if event has already passed
            if (moment(dateOfEvent).isBefore(currentDate)) { continue }

            // Only include events that the user should see here
            if (userType == 'admin' || eventClassification == 'both' || eventClassification == userType) {
                events.push(dateOfEvent);
            }
        }

        this.setState({eventDates: events});
        this.setState({markedDates: this.getMarkedDatesForCalendar(events)});
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

    getMarkedDatesForCalendar = (arr) => {
        arr.sort()
        let dotColorArray = [dot_color]
        let obj = arr.reduce((c, v) => Object.assign(c, { [v]: { dots: dotColorArray, selected: true, selectedColor: '#c75b12'} }), {});
        return obj
    }

    handleDayClick = (day) => {
        for (let date in this.state.markedDates) {
            if (day.dateString === date) {
                this.props.navigation.navigate("Agenda", { day });
                return;
            }
        }
        alert('Aw Snap! We don\'t have any events to show for this date. Sorry!');
    }

    render() {

        let currentDate  = moment().toISOString(true).slice(0, 10);

        return (
            <View>
                <CalendarList
                    // Max amount of months allowed to scroll to the past. Default = 50
                    pastScrollRange={0}
                    // Max amount of months allowed to scroll to the future. Default = 50
                    futureScrollRange={6}
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
            </View>
        )
    }
}
