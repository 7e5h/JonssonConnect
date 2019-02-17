import React, { Component } from 'react';
import { Picker, Text, View, StyleSheet, ScrollView, Button, TouchableOpacity, Alert, AsyncStorage, Linking } from 'react-native';
import { Container, Header, Content, Accordion, Form, Item, Input, Label } from "native-base";
import * as firebase from 'firebase';

const TUTORIAL_COMPLETED_KEY = "tutorialCompleted";
const RCTNetworking = require("RCTNetworking");

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      userClassification: '',
    };
  }

  loadedClassification = (newClassification) => {
    let value = newClassification.val();

    if(value != null) {
      AsyncStorage.setItem('userClassification', value);
      this.setState({
        userClassification: value
      });
    }
  }

  updateClassification = (newClassification) => {
    if(newClassification != null && (newClassification === "student" || newClassification === "alumni")) {
      AsyncStorage.setItem('userClassification', newClassification);
      this.setState({
        userClassification: newClassification
      });

      let userRef = firebase.database().ref("Users/" + this.state.userID + "/");
      userRef.update({
        classification: newClassification,
      }).then(function () {
        console.log('Classification updated. newClassification=' + newClassification);
      }).catch(function (error) {
        console.log('Classification update failed. Error: ' + error);
      });
    }
  }

  logout = async () => {
    console.log("Log out initiated");

    await AsyncStorage.clear();
    await AsyncStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');

    // Must clear cookies in web browser to be able to login with different account
    this.clearCookies();

    this.props.navigation.navigate('Login');
  }

  clearCookies() {
    RCTNetworking.clearCookies((cleared) => {
      console.log('Cookies cleared, had cookies=' + cleared.toString());
    })
  }

  async componentDidMount() {
    this.setState({
      userID: await AsyncStorage.getItem('userID'),
      userClassification: await AsyncStorage.getItem('userClassification'),
    });

    //Update classification
    let classificationRef = firebase.database().ref("Users/" + this.state.userID + "/classification/");
    classificationRef.on('value', this.loadedClassification, (err) => console.log(err));
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.row}>
            <Text style={styles.settingsLabel}>Classification: </Text>
            <Picker style={{height: 50, width: '40%'}} selectedValue={this.state.userClassification} onValueChange={this.updateClassification}>
              <Picker.Item label="Student" value="student" />
              <Picker.Item label="Alumni" value="alumni" />
            </Picker>
          </View>

          <View style={styles.row}>
            <Button onPress={this.logout} title="Log Out" color="#841584" />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  settingsLabel: {
    fontSize: 16,
  }
});
