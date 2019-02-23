import React, { Component } from 'react';
import { ActivityIndicator, Alert, AsyncStorage, Button, Linking, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Accordion, Form, Icon } from "native-base";
import * as firebase from 'firebase';


const TUTORIAL_COMPLETED_KEY = "tutorialCompleted";
const appJson = require('../app.json');

export default class Help extends Component {
  constructor(props) {
    super(props);
    this.state = {
      giveFeedback: false,
      message: '',
      isLoading: false,
      dataArray: [],
      userEmail: '',
    };
  }

  readFAQs = () => {
    //Get the FAQs from Firebase and put them in this.state.dataArray

    var arr = [];
    var self = this;

    //Fetch the FAQs from Firebase
    fetch('https://jonssonconnect.firebaseio.com/FAQ.json')
      .then((response) => response.json())
      .then((responseJson) => {
        for(let faq in responseJson) {
          arr.push({
            "title": responseJson[faq].Question,
            "content": responseJson[faq].Answer
          });
        }

        self.setState({
            dataArray: arr
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async componentWillMount() {
    //We need the email in case they submit feedback. The email will be submitted with feedback
    this.setState({
      userEmail: await AsyncStorage.getItem('email'),
    });
  }

  postFeedback = (email, message) => {
    const self = this;

    //Send feedback to Firebase
    fetch('https://jonssonconnect.firebaseio.com/Feedback.json', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        'email': email,
        'message': message,
        'date': new Date().toISOString()
      })
    })
      .then((response) => response.json())
      .then((responseData) => {
        if(!responseData.error) {
          self.setState({
            message: '',
            giveFeedback: false,
            isLoading: false
          });

          Alert.alert(
            "Feedback Received",
            "We have submitted your feedback."
          );
        } else {
          Alert.alert(
            "Error While Submitting Feedback",
            responseData.error
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  replayTutorialPressed = () => {
    //Set the tutorial completed to false and send the user back to the login page
    AsyncStorage.setItem(TUTORIAL_COMPLETED_KEY, 'false');
    this.props.navigation.navigate("Login");
  };

  feedbackSubmitted = () => {
    let msg = this.state.message;

    //Only submit if msg has a length greater than 0 and isn't all whitespace
    if(msg && msg.trim().length > 0) {
      this.setState({
        isLoading: true
      });

      this.postFeedback(this.state.userEmail, this.state.message);
    } else {
      //The user didn't type anything
      Alert.alert(
        "Message Field Blank",
        "Please type your feedback before submitting."
      );
    }
  };

  renderHeader = (item, expanded) => {
    /*Does a custom rendering of the header of the Accordion element

      The reason we used a custom header is because the text kept pushing
      the arrow icon off the screen on smaller screens. Limited the width
      to 85% in order to prevent that.
    */

    return (
      <View style={{
        flexDirection: "row",
        padding: 10,
        justifyContent: "space-between",
        alignItems: "center" ,
        backgroundColor: "#A9DAD6" }}>

        <Text style={{ fontWeight: "600", width: "85%" }}>
          {item.title}
        </Text>
        {expanded
          ? <Icon style={{ fontSize: 18 }} name="arrow-up" />
          : <Icon style={{ fontSize: 18 }} name="arrow-down" />}
      </View>
    );
  }

  componentDidMount() {
    this.readFAQs();
  }

  _getBuildNumber() {
    //Gets the build number from app.json.
    return appJson.expo.version;
  }

  _renderFeedback() {
    if(this.state.giveFeedback) {
      //User has pressed the "Give Feedback" buttonText
      //Render a form to take their feedback

      return (
        <Form style={styles.formView}>
          <Text style={styles.bodyText}>
            How can we improve?
          </Text>

          <View style={styles.feedbackContainer}>
            <TextInput
              multiline={true}
              placeholder="Feedback"
              onChangeText={message => this.setState({message})}
              name="message"
              style={styles.textInput}
              underlineColorAndroid='rgba(0,0,0,0)'
            >
              <Text>{this.state.message}</Text>
            </TextInput>
          </View>

          <Text style={styles.bodyText}>
            Note: The email address that you used to sign in will be sent along with your feedback.
            This will help us reach out to you if we need to after reading your feedback!
          </Text>

          <View style={StyleSheet.flatten([styles.button, {alignItems: 'center'}])}>
            {this.state.isLoading
              ? <ActivityIndicator />
              : <Button onPress={this.feedbackSubmitted} title="Submit Feedback" color="#008542" />
            }
          </View>
        </Form>
      );
    } else {
      //User has not pressed "Give Feedback" button yet
      //Render the button

      return (
        <View style={styles.button}>
          <Button
            style={styles.button}
            onPress={() => {this.setState({ giveFeedback: true });}}
            title="Give Feedback"
            color="#008542"
          />
        </View>
      );
    }
  }

  render() {
    return (
      <ScrollView style={styles.masterView}>
        <Text style={styles.headerText}>PRIVACY POLICY</Text>
        <Text style={styles.bodyText}>
          We take your privacy very seriously.
        </Text>

        <View style={styles.button}>
          <Button
            onPress={() => {Linking.openURL('https://utdallas.edu/privacy/');}}
            title="View Privacy Policy"
            color="#008542"
          />
        </View>

        <Text style={styles.headerText}>FREQUENTLY ASKED QUESTIONS</Text>
        <Text style={styles.bodyText}>
          If you cannot find the answers that you are looking for, fill out
          the feedback form at the bottom and we'll get back to you as soon
          as possible.
        </Text>

        <View>
          <Accordion
            style={{ paddingHorizontal: 20, paddingVertical: 15 }}
            dataArray={this.state.dataArray}
            renderHeader={this.renderHeader}
            headerStyle={{
              backgroundColor: '#E6E6E6',
              padding: 5,
              borderColor: '#BDBDBD',
              borderStyle: 'solid',
              borderWidth: 1,
            }}
          />
        </View>

        {this._renderFeedback()}

        <View style={styles.button}>
          <Button
            onPress={this.replayTutorialPressed}
            title="Replay Tutorial"
            color="#008542"
          />
        </View>

        <Text style={styles.bodyText}>
          Build Number: {this._getBuildNumber()}
        </Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  masterView: {
      backgroundColor: '#FFFFFF',
  },
  headerText: {
    fontSize: 20,
    paddingHorizontal: 20,
    paddingVertical: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    color: "#C75B12"
  },
  bodyText: {
    alignSelf: 'center',
    textAlign: 'left',
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  formView: {
    paddingVertical: 10,
  },
  button: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  textInput: {
    width: '100%',
    backgroundColor: '#ecf0f1',
    padding: 10,
    paddingTop: 10    //It is uncentered on iOS without this line for some reason
  },
  feedbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20
  },
});
