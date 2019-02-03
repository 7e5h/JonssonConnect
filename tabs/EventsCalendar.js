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

const dot_color = { color: 'white' }; // Constant dot color
// var massage = {color: 'blue'};
// var workout = { color: 'green'};
// const blah = { color: 'yellow'};
// const fee = { color: 'black'};


export default class EventsCalendar extends Component {

    constructor(props) {

        super(props);
        this.state = {
            marked: false,
            formattedDate: [],
            'classi': '',
            formattedBothDate: [],
        }

        this.gotClassificationData = this.gotClassificationData.bind(this)

    }


    async componentWillMount() {
        // var eventsRef = firebase.database().ref('Events');
        // var dateArray = [];
        // eventsRef.orderByChild('eventDate').on('child_added', function(snapshot) {
        //     console.log(snapshot.key + " has event date " + snapshot.val().eventDate);
        //     dateArray.push(snapshot.val().eventDate);
        //     var splitArray = dateArray.split('T');
        //     console.log('this is the dateArray vccc' + dateArray);
        // });
        // queryDates.once('value', data => {
        //     var goodData = data.val();
        //     for (var date in goodData) {
        //         console.log('These are the date values that vc wrote' + date);
        //     }
        // });
        // When you press calendar symbol, it logs the event dates formatted in the form of "formattedDate" list.
        /******************************************************************************************************** */
        this.setState({
            userID: await AsyncStorage.getItem('userID'),
            classi: await AsyncStorage.getItem('classi')
        });
        console.log("OUR USER ID@%$&$^%*$^*$: " + this.state.userID)

        var userClassificationRef = firebase.database().ref("Users/" + this.state.userID + "/classification/");
        userClassificationRef.on('value', this.gotClassificationData, this.classificationerrData);

        console.log("CLALASLSDA: " + this.state.classi)

        var bothEventsRef = firebase.database().ref("Events/").orderByChild("eventClassification").startAt("alumni").endAt("alumni" + "\uf8ff");
        bothEventsRef.on('value', this.gotBothClassificationEventData, this.bothClassificationerrData);




        // if (this.state.classi === null) {
        var dateOfEvent = firebase.database().ref("Events/").orderByChild("eventClassification").startAt("student").endAt("student" + "\uf8ff");
        dateOfEvent.on('value', this.gotData, this.errData);
        // }
        // else {
        //     var dateOfEvent = firebase.database().ref("Events/").orderByChild("eventClassification").startAt(this.state.classi.toString()).endAt(this.state.classi.toString() + "\uf8ff");
        //     dateOfEvent.on('value', this.gotData, this.errData);
        // }



        /************************************************************************************************** */
    }

    gotBothClassificationEventData = (data) => {

        console.log("DATA FROM GOT BOTH CLASSIFICATION: " + data.val())
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

            // var myDates = date_of_event.split("-")
            // var yearKalasala = myDates[0]
            // var moKalasala = myDates[1]
            // var daKalasala = myDates[2]


            // if (parseInt(moKalasala) <= 9)
            //     moKalasala = '0' + moKalasala;
            // if (parseInt(daKalasala) <= 9)
            //     daKalasala = '0' + daKalasala;

            //     date_of_event = yearKalasala + "-" + moKalasala + "-" + daKalasala

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

    bothClassificationerrData = (err) => {
        console.log("ERROR FROM BOTH CLASSIFICATION")
    }

    gotClassificationData = (data) => {


        AsyncStorage.setItem('classi', data.val());
        this.setState({ 'classi': data.val() });


        this.setState({ classi: data.val() });


    }

    classificationerrData = (err) => {
        console.log(err);
    }

    gotData = (data) => {
        var dates = data.val()
        var keys = Object.keys(dates)
        var formattedDate = []


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
            var date_of_event = dates[k].modifiedDate;

            // var myDates = date_of_event.split("-")
            // var yearKalasala = myDates[0]
            // var moKalasala = myDates[1]
            // var daKalasala = myDates[2]


            // // if (parseInt(moKalasala) <= 9)
            // //     moKalasala = '0' + moKalasala;
            // // if (parseInt(daKalasala) <= 9)
            // //     daKalasala = '0' + daKalasala;

            //     date_of_event = yearKalasala + "-" + moKalasala + "-" + daKalasala

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

        // var dottom = Array(1).fill(eval('dot_color')) // creating array of variable names

        // for (var i = 0; i < difference.length; i++) {
        //     obj[difference[i]] = { dots: dottom, selected: true, selectedColor: '#c75b12' }
        //     //Do something
        // }



        this.setState({ marked: obj });
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

        console.log("msg for filter:" + JSON.stringify(this.state.marked))
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
                    // markedDates={this.state.marked}
                    //This attribute enables multiple dots on a single date
                    markingType={'multi-dot'}
                    // callback that gets called on day press
                    onDayPress={(day) => {
                        //if (someVariable == true)
                        //{
                        console.log("STRINGIFY: " + JSON.stringify(day.dateString));
                        var hasEvent = false;
                        for (var date in this.state.marked) {
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
                        // var dateString = JSON.stringify(day.dateString)

                        //} 
                    }}
                />
            </View>
        )
    }
}