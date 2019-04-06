import React, { Component } from 'react';
import { View, Text, StyleSheet, WebView } from 'react-native';

const jsCode = 'window.postMessage(document.documentElement.innerHTML.toString())'; 
const UTD_SSO_LOGIN_URL = 'https://wwwdev.utdallas.edu/oit/mobileapps/JonssonConnect/webauth.php'; 

export default class WebSSOLogin extends Component {

  static navigationOptions = {
    title: 'UTD Login'
  }

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  handleMessage = (event) => {

    // TODO: - Validate this is the response for successfully logging in through SSO
    let dataString = String(event.nativeEvent.data); 

    if (dataString == null || dataString == 'null' || dataString === '') {
      // TODO: - Handle error 
      console.log("ERROR"); 
      return;
    }

    let firstIndex = dataString.indexOf("{"); 
    let lastIndex = dataString.lastIndexOf("}") + 1; 

    let jsonSubString = dataString.substring(firstIndex, lastIndex); 
    let response = JSON.parse(jsonSubString); 

    // TODO: - Parse out the values needed from the json
    let handler = response['Handler']; 
    console.log(handler); 

    // TODO: - Return a result to the previous screen for success or failure


  }

  navigationStateChanged = (event) => {
    // TODO: - Find a better way to single out the response page
    if (event.url === UTD_SSO_LOGIN_URL) {
      this.myWebview.injectJavaScript(jsCode); 
    }
  }

  render() {
    return (
        <WebView
          ref={webview => {this.myWebview = webview;}} 
          source={{ uri: UTD_SSO_LOGIN_URL }}
          style={styles.webView}
          javaScriptEnabled={true}
          useWebKit={true}
          onMessage={(event)=> this.handleMessage(event)}
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
