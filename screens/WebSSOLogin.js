import React, { Component } from 'react';
import { View, Text, StyleSheet, WebView, AsyncStorage } from 'react-native';

const jsCode = 'window.postMessage(document.documentElement.innerHTML.toString())';
const UTD_SSO_LOGIN_URL = 'https://wwwdev.utdallas.edu/oit/mobileapps/JonssonConnect/webauth.php';

export default class WebSSOLogin extends Component {

    static navigationOptions = {
        title: 'UTD Login'
    }

    constructor(props) {
        super(props);
    }

    handleMessage = async (event) => {

        console.log(event.nativeEvent.url);

        // TODO: - Validate this is the response for successfully logging in through SSO
        let dataString = String(event.nativeEvent.data);

        if (dataString == null || dataString == 'null' || dataString === '') {
            // TODO: - Handle error 
            console.log("ERROR");
            return;
        }

        let firstIndex = dataString.indexOf("{");
        let lastIndex = dataString.lastIndexOf("}") + 1;

        if (firstIndex <= 0 || lastIndex <= 0) {
            console.log("ERROR");
            return;
        }

        let jsonSubString = dataString.substring(firstIndex, lastIndex);
        let response = JSON.parse(jsonSubString);

        // TODO: - Parse out the values needed from the json
        let userInfo = this.getUserValues(response);

        console.log(userInfo);

        // TODO: - User Logged in successfully (save info and login)
        await this.saveUserData(userInfo);
        this.userLoggedInSuccessfully();
    }

    navigationStateChanged = (event) => {

        // TODO: - Find a better way to single out the response page
        if (event.url === UTD_SSO_LOGIN_URL && event.navigationType == null) {
            this.myWebview.injectJavaScript(jsCode);
        }
    }

    //
    //  Handling logged in user flow
    //
    getUserValues = (json) => {

        let uid = json.mail;
        let classification = 'student';
        let firstName = json.givenName;
        let lastName = json.sn;
        let email = json.mail;
        let major = json.majorName;
        let schoolClass = json.class;

        // TODO: - Validate all information is returned

        // TODO: - Correct any values 
        uid = uid.replace('@utdallas.edu', '');

        let userInfo = {
            uid: uid,
            firstName: firstName,
            lastName: lastName,
            email: email,
            major: major,
            schoolClass: schoolClass
        }

        return userInfo;
    }

    async saveUserData(userInfo) {
        // Everything in UserInfo should already be verified by this point
        await AsyncStorage.setItem('userID', userInfo.uid);
        await AsyncStorage.setItem('lastName', userInfo.lastName);
        await AsyncStorage.setItem('firstName', userInfo.firstName);
        await AsyncStorage.setItem('email', userInfo.email);
        await AsyncStorage.setItem('major', userInfo.major);
        await AsyncStorage.setItem('schoolClass', userInfo.schoolClass);
        await AsyncStorage.setItem('isLoggedIn', "loggedIn");
    }

    userLoggedInSuccessfully = () => {
        this.setState({ loggedInStatus: 'loggedIn' });
        this.props.navigation.navigate('DrawerNavigator');
    }

    render() {
        return (
            <WebView
                ref={webview => { this.myWebview = webview; }}
                source={{ uri: UTD_SSO_LOGIN_URL }}
                style={styles.webView}
                javaScriptEnabled={true}
                useWebKit={true}
                onMessage={(event) => this.handleMessage(event)}
                onNavigationStateChange={(event) => this.navigationStateChanged(event)}
            />
        );
    }
}

const styles = StyleSheet.create({
    webView: {
        marginTop: 20,
    }
}); 
