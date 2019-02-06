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

const dot_color = { color: 'white' };

export default class EventsCalendar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userClassification: '',
            markedDates: false,
            formattedDate: [],
            formattedBothDate: [],
        }

        this.gotClassificationData = this.gotClassificationData.bind(this)
    }

    async componentWillMount() {



        this.setState({
            userID: await AsyncStorage.getItem('userID'),
            userClassification: await AsyncStorage.getItem('userClasification')
        });

        let userClassificationRef = firebase.database().ref("Users/" + this.state.userID + "/classification/");
        userClassificationRef.on('value', this.gotClassificationData, this.printError);

        let alumniEvents = firebase.database().ref("Events/").orderByChild("eventClassification").startAt("alumni").endAt("alumni" + "\uf8ff");
        alumniEvents.on('value', this.gotBothClassificationEventData, this.printError);

        let studentEvents = firebase.database().ref("Events/").orderByChild("eventClassification").startAt("student").endAt("student" + "\uf8ff");
        studentEvents.on('value', this.gotData, this.printError);
    }

    gotBothClassificationEventData = (data) => {

        var bothdates = data.val()
        var keys = Object.keys(bothdates)
        var formattedBothDate = []

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        
        var today = yyyy + '-' + mm + '-' + dd;

        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var date_of_event = bothdates[k].modifiedDate;

            var format_res = date_of_event;

            if (format_res < today || format_res === null) {
                console.log('lesser');
            }
            else if (format_res >= today) {

             formattedBothDate[i] = format_res
            }
        }

        // Set formattedDate array that is initialized in state to values of local formattedDate array
        // and then call anotherFunc
        this.setState({ formattedBothDate: formattedBothDate });

        console.log('FORMATTED BOTH DATE: ' + this.state.formattedBothDate);
    }

    gotClassificationData = (newClassification) => {
        AsyncStorage.setItem('userClasification', newClassification.val());
        this.setState({ 'userClasification': newClassification.val() });
        this.setState({ userClasification: newClassification.val() });
    }

    gotData = (data) => {
        console.log("REACHED COMPONENTWILLMOUNT");

        var dates = data.val()
        var keys = Object.keys(dates)
        var formattedDate = []


        var today = new Date();
        var day = today.getDate();
        var month = today.getMonth() + 1; //January is 0!

        var year = today.getFullYear();
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }

        var today = year + '-' + month + '-' + dd;


        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var date_of_event = dates[k].modifiedDate;

            var format_res = date_of_event;


            if (format_res < today || format_res === null) {
               console.log('lesser');
            }
            else if (format_res >= today) {

                formattedDate[i] = format_res
            }



        }

        // Set formattedDate array that is initialized in state to values of local formattedDate array
        // and then call anotherFunc
        this.setState({ formattedDate }, this.anotherFunc);

        console.log('formatted date in state is ' + this.state.formattedDate);
    }

    errData = (err) => {
        console.log(err);
    }

    printError = (err) => {
        console.log(err);
    }

    // call function after you successfully get value in nextDay array

    anotherFunc = () => {
        var nextDay = this.state.formattedDate.concat(this.state.formattedBothDate);

        console.log("KALASALA NNEXT DAY :" + nextDay)

        var sorted_arr = nextDay.slice().sort(); // You can define the comparing function here. \\

        console.log("KALASALA SORTED: " + sorted_arr)
        // JS by default uses a crappy string compare.
        // (we use slice to clone the array so the
        // original array won't be modified)
        var results = [];
        for (var i = 0; i < sorted_arr.length - 1; i++) {
            if (sorted_arr[i + 1] == sorted_arr[i]) {
                results.push(sorted_arr[i]);
            }
        }

        console.log("RESULTS ARRAY: "+results);
        //var orginal_dates = ["2018-11-14", "2019-01-01", "2018-10-18"]

        var b1 = new Set(results);
        var difference = [...new Set([...nextDay].filter(x => !b1.has(x)))];

        console.log("DIFFERENCE ARRAY  : "+difference);

        var dot_color_array = Array(1).fill(eval('dot_color')) // creating array of variable names

        var obj = sorted_arr.reduce((c, v) => Object.assign(c, { [v]: { dots: dot_color_array, selected: true, selectedColor: '#c75b12' } }), {});

        this.setState({ markedDates: obj });
    }

    render() {
        const date = new Date()
        var year = date.getFullYear()
        var month = date.getMonth() + 1;
        if (month <= 9)
            month = '0' + month;
        var day = date.getDate();
        if (day <= 9)
            day = '0' + day;
        var fullDate = year + '-' + month + '-' + day;
        var stringDate = fullDate.toString();
        console.log('this is fulldateeeeeee' + stringDate);

        console.log("msg for filter:" + JSON.stringify(this.state.markedDates))
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
                    minDate={stringDate}
                    // By default, agenda dates are marked if they have at least one item, but you can override this if needed
<<<<<<< Updated upstream
                    // markedDates={this.state.marked}
=======
                    markedDates={this.state.markedDates}
>>>>>>> Stashed changes
                    //This attribute enables multiple dots on a single date
                    markingType={'multi-dot'}
                    // callback that gets called on day press
                    onDayPress={(day) => {

                      console.log("STRINGIFY: " + JSON.stringify(day.dateString));
                      var hasEvent = false;

                      for (var date in this.state.markedDates) {
                          console.log('This is marked state object: ' + date);
                          if (day.dateString == date) {
                              hasEvent = true;
                          }
                      }

                      if (hasEvent) {
                          this.props.navigation.navigate("Agenda", { day });
                      } else {
                          alert('Aw Snap! We don\'t have any events to show for this date. Sorry!');
                      }

                    }}
                />
            </View>
        )
    }
}
