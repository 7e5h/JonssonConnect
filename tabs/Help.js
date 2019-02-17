import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, Button, TouchableOpacity, Alert, AsyncStorage, Linking } from 'react-native';
import { Container, Header, Content, Accordion, Form, Item, Input, Label } from "native-base";
import * as firebase from 'firebase';
import Axios from 'axios';


const TUTORIAL_COMPLETED_KEY = "tutorialCompleted";

export default class Help extends Component {

    constructor(props) {
        super(props);
        this.state = {
            giveFeedback: false,
            email: '',
            message: '',
            isLoading: false,
            dataArray: [],
            userEmail: '',
        };
        this.feedbackSubmitted = this.feedbackSubmitted.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.postFeedback = this.postFeedback.bind(this);
        this.readUserData = this.readUserData.bind(this);
    }

    readUserData() {
        //console.log('entering')
        var arr = [];
        var self = this;
        fetch('https://jonssonconnect.firebaseio.com/FAQ.json?auth=qKeO1eylfWgscqfLFVGMv298g6KlHo0BRN8E2kFb')
            .then((response) => response.json())
            .then((responseJson) => {

                Object.keys(responseJson).forEach(function (key) {
                    var data = responseJson[key];
                    arr.push({ "title": data.Question, "content": data.Answer });
                });

                //console.log(responseJson)
                //console.log(arr)
                self.setState({
                    dataArray: arr
                });
            })
            .catch((error) => {
                console.error(error);

            });

    }

    handleEmailChange(e) {
        this.setState({
            userEmail: e
        });
    }
    handleMessageChange(e) {
        this.setState({
            message: e
        })
    }

    async componentWillMount() {
        this.setState({
            userEmail: await AsyncStorage.getItem('email'),
        });
        console.log("ASYNC EMAIL ID: " + this.state.userEmail)
    }

    /**************/
    postFeedback = (email, message, emailClear, messageClear) => {
        if (this.state.message != null) {
            if (!this.state.isLoading) {
                const self = this;
                fetch('https://jonssonconnect.firebaseio.com/Feedback.json?auth=qKeO1eylfWgscqfLFVGMv298g6KlHo0BRN8E2kFb', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                    body: JSON.stringify({
                        "email": email,
                        "message": message,
                    })
                })
                    .then((response) => response.json())
                    .then((responseData) => {
                        if (!responseData.error) {
                            self.setState({
                                email: '', message: '',
                                isSubmited: true,
                                giveFeedback: false,
                                isLoading: false
                            })
                        }
                        else {
                            Alert.alert(
                                responseData.error,
                                [
                                    { text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },

                                ],
                                { cancelable: false }
                            )
                        }
                    })
                    .catch((err) => {

                    })

            }
        }
        else {
            Alert.alert(
                'Oops!',
                'Press the SUBMIT button after entering your message.',
                [
                    { text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                ],
                { cancelable: false }
            )
        }
    };

    hasWhitespace(str) {
        return (!str || str.length === 0 || /^\s*$/.test(str))
    }


    giveFeedbackPressed = () => {
        this.setState({ giveFeedback: true });
    };

    replayTutorialPressed = () =>{
        AsyncStorage.setItem(TUTORIAL_COMPLETED_KEY, 'false');
        this.props.navigation.navigate("Login");
    };

    feedbackSubmitted = () => {
        if (this.hasWhitespace(this.state.message) || this.state.message === null) {
            Alert.alert(
                'Oops!',
                'We noticed that the message field is blank. \n\nDid you tap the feedback button by mistake?',
                [
                    { text: 'LOL, Yea!', onPress: () => console.log('blankFeedbackMessage acknowledged!') },
                ],
                { cancelable: false }
            )
        }
        else {
            this.setState({
                isLoading: true
            });

            Alert.alert(
                "Awesome!",
                "We've recieved your feedback! Thanks!",
                [
                    { text: 'Awesome!', onPress: () => console.log('Feedback Submitted!') },
                ],
                { cancelable: false }
            );
            this.setState({
                isLoading: true
            });
            this.postFeedback(this.state.userEmail, this.state.message);
        }
    };

    componentDidMount() {
        this.readUserData();
    }

    render() {

        if (this.state.giveFeedback == false) {
            console.log("USER EMAIL ID: " + this.state.userEmail);
            return (
                <ScrollView style={styles.masterView}>
                    <Text style={{ fontSize: 20, paddingHorizontal: 20, textAlign: 'center', paddingVertical: 25, fontWeight: 'bold', color: "#C75B12" }}>
                        PRIVACY POLICY
                    </Text>
                    <TouchableOpacity>
                        <Text style={{ textAlign: 'center', paddingVertical: 5, fontStyle: "italic" }} onPress={() => { Linking.openURL('https://utdallas.edu/privacy/') }}>
                            <Text>We take your privacy seriously.</Text>
                        </Text>
                        <Text style={{ textAlign: 'center', paddingVertical: 5, fontStyle: "italic" }} onPress={() => { Linking.openURL('https://utdallas.edu/privacy/') }}>
                            <Text>You can view our Privacy Policy by tapping here.</Text>
                        </Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, textAlign: 'center', paddingTop: 25, fontWeight: 'bold', color: "#C75B12" }}>
                        FREQUENTLY ASKED QUESTIONS
                    </Text>
                    <Text style={{ paddingHorizontal: 20, textAlign: 'left', paddingVertical: 25, fontWeight: 'bold' }}>
                        Below, you will find some of the most Frequently Asked Questions (hence, FAQ) and our answers.
                        If you don't find the answers you are looking for, fill out the feedback form at the bottom
                        and we'll get back to you ASAP.</Text>
                    <View>
                        <Accordion

                            dataArray={this.state.dataArray}
                            headerStyle={{ backgroundColor: "#FFFFFF" }}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={this.giveFeedbackPressed}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Give Feedback</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.replayTutorialPressed}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Replay Tutorial</Text>
                    </TouchableOpacity>
                    <View style={styles.bottom1}>
                        <Text style={styles.buildStyle}>Build Number: 2.1.10</Text>
                    </View>

                </ScrollView>
            );
        } else {
            console.log("USER EMAIL ID: " + this.state.userEmail);
            return (
                <ScrollView style={styles.masterView}>
                <Text style={{ fontSize: 20, paddingHorizontal: 20, textAlign: 'center', paddingVertical: 25, fontWeight: 'bold', color: "#C75B12" }}>
                        PRIVACY POLICY
                    </Text>
                    <TouchableOpacity>
                        <Text style={{ textAlign: 'center', paddingVertical: 5, fontStyle: "italic" }} onPress={() => { Linking.openURL('https://utdallas.edu/privacy/') }}>
                            <Text>We take your privacy seriously.</Text>
                        </Text>
                        <Text style={{ textAlign: 'center', paddingVertical: 5, fontStyle: "italic" }} onPress={() => { Linking.openURL('https://utdallas.edu/privacy/') }}>
                            <Text>You can view our Privacy Policy by tapping here.</Text>
                        </Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, textAlign: 'center', paddingTop: 25, fontWeight: 'bold', color: "#C75B12" }}>
                        FREQUENTLY ASKED QUESTIONS
                    </Text>
                    <Text style={{ paddingHorizontal: 20, textAlign: 'left', paddingVertical: 25, fontWeight: 'bold' }}>
                        Below, you will find some of the most Frequently Asked Questions (hence, FAQ) and their answers.
                        If you don't find the answers you are looking for, scroll down to the bottom and fill out the feedback form
            and we'll get back to you ASAP.</Text>
                    <View>
                        <Accordion
                            dataArray={this.state.dataArray}
                            headerStyle={{ backgroundColor: "#FFFFFF" }}
                        />
                    </View>

                    <Form style={styles.formView}>
                        {/* <Item stackedLabel>
                            <Label>Email ID (@utdallas.edu is preferred!)</Label>
                            <Input value={this.state.email} onChangeText={(e)=>{this.handleEmailChange(e)}} name="email"/>
                        </Item> */}

                        <Item stackedLabel>
                            <Label>How can we improve?</Label>
                            <Input value={this.state.message} onChangeText={(e) => { this.handleMessageChange(e) }} name="message" />
                        </Item>
                        <Text style={{ paddingHorizontal: 30, textAlign: 'center', paddingTop: 35}}>
                            Note: The email ID that you used to sign in will be sent along with your feedback.
                        This will help us reach out to you if we need to after reading your feedback!</Text>
                        <TouchableOpacity
                            onPress={this.feedbackSubmitted}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>{this.state.isLoading ? 'Submitting... Give Us A Sec!' : 'Submit'}</Text>
                        </TouchableOpacity>

                    </Form>
                    <View style={styles.bottom}>
                        <Text style={styles.buildStyle}>Build Number: 2.1.10</Text>
                    </View>
                </ScrollView>
            );
        }
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
        padding: 10,
        marginTop: 20,
    },
    buttonText: {
        color: '#E98300',
        fontSize: 16,
        // borderWidth: 0.5,
        // borderRadius: 10,
        // padding: 10
    },
    masterView: {
        backgroundColor: '#FFFFFF',
    },
    formView: {
        paddingTop: 40,
    },

    bottom1: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    bottom: {
        flex: 1,
    },

    buildStyle: {
        textAlign: 'center',
        //justifyContent: 'space-between',
        // bottom: 0,
        color: 'grey'
    }
});
