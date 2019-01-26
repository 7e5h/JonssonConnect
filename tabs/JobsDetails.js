/**
 * JonssonConnect Job Details Page
 * https://github.com/mendoza-git/JonssonConnect
 * @flow
 */
import React, { Component } from 'react';
import { ActivityIndicator, Image, ListView, Linking, FlatList, StyleSheet, View, ImageBackground } from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from "react-navigation";
import { Container, Header, Content, Card, Col, CardItem, Grid, Thumbnail, List, ListItem, Icon, Item, Input, Text, Title, Button, Left, Body, Right, Row, H1, H2, H3 } from 'native-base';
import * as firebase from 'firebase';

export default class JobsDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    return fetch('https://jonssonconnect.firebaseio.com/Jobs.json')
      .then((response) => response.json())
      .then((responseJson) => {
        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson),
        }, function () {
          // do something with new state
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  static navigationOptions = {
    tabBarLabel: 'Jobs',
    tabBarIcon: ({ tintcolor }) => (
      <Image
        source={require('../images/briefcaseicon.png')}
        style={{ width: 22, height: 22 }}>
      </Image>
    )
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <Container style={styles.containerStyle}>
        <Content>
          <View style={styles.container2}>
            <ImageBackground
              style={styles.backdrop}
              blurRadius={3}
              source={{ uri: this.props.navigation.state.params.rowData.backgroundURL }}>
              <View style={styles.backdropView}>
                <Thumbnail square source={{ uri: this.props.navigation.state.params.rowData.companyImageURL }} />
                <Text style={styles.positionheadline}>{this.props.navigation.state.params.rowData.positionTitle}</Text>
                <Text style={styles.companyheadline}>{this.props.navigation.state.params.rowData.companyName}</Text>
                <Text style={styles.locationheadline}>{this.props.navigation.state.params.rowData.jobLocation}</Text>
              </View>
            </ImageBackground>
          </View>
          <Card style={{ backgroundColor: '#f8f6f6' }}>
            <Button full style={styles.buttonStyle} onPress={() => { Linking.openURL(this.props.navigation.state.params.rowData.applicationURL) }}>
              <Text style={{ fontSize: 18, fontWeight: '500', textAlign: 'center' }}><Icon name='ios-link' style={{ fontSize: 18, color: '#ffffff' }} /> Apply Now</Text>
            </Button>
          </Card>
          <Text style={{ fontSize:18, fontWeight: '200', paddingLeft: 15, paddingTop: 10, color: '#C75B12', textAlign: 'center' }}><Icon name='ios-flash' style={{ fontSize: 20, color: '#C75B12' }} /> Position Overview</Text>
          <Text style={styles.descriptionStyle}>{'\n' + this.props.navigation.state.params.rowData.positionOverview + '\n\n'}</Text>
          
          <Text style={{ fontSize: 18, fontWeight: '200', paddingLeft: 15, paddingTop: 10, color: '#C75B12', textAlign: 'center' }}><Icon name='ios-stats' style={{ fontSize: 20, color: '#C75B12' }} /> Qualifications</Text>
          <Text style={styles.descriptionStyle2}>{'\n' + this.props.navigation.state.params.rowData.positionQualifications + '\n\n'}</Text>
          
          <Text style={{ fontSize: 18, fontWeight: '200', paddingLeft: 15, paddingTop: 10, color: '#C75B12', textAlign: 'center' }}><Icon name='ios-school' style={{ fontSize: 20, color: '#C75B12' }} /> Desired Major(s)</Text>
          <Text style={styles.descriptionStyle}>{'\n' + this.props.navigation.state.params.rowData.desiredMajors + '\n\n'}</Text>
          
          <Text style={{ fontSize: 18, fontWeight: '200', paddingLeft: 15, paddingTop: 10, color: '#C75B12', textAlign: 'center' }}><Icon type='MaterialCommunityIcons' name='worker' style={{ fontSize: 20, color: '#C75B12' }} /> Job-Type</Text>
          <Text style={styles.descriptionStyle}>{'\n' + this.props.navigation.state.params.rowData.jobType + '\n\n'}</Text>

          <Text style={{ fontSize: 14, fontWeight: '800', alignSelf: 'center' }}>Check Us Out On Handshake! {'\t'} :) {'\n\n'}</Text>
          <Text style={{ fontSize: 10, fontWeight: '100', color: '#b6b6b6', alignSelf: 'center' }}> --- End of Job Details --- {'\n'}</Text>

        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: '#FFFFFF',
  },
  applicationStyle: {
    fontWeight: '600',
    fontSize: 12,
  },
  buttonStyle: {
    backgroundColor: '#008542',
    height: 40,
  },
  nameStyle: {
    fontWeight: '600',
    fontSize: 16,
  },
  descriptionStyle2: {
    fontWeight: '100',
    fontSize: 15,
    paddingHorizontal: 20,
  },
  descriptionStyle: {
    fontWeight: '100',
    fontSize: 15,
    paddingHorizontal: 20,
    textAlign: 'center'
  },
  hostStyle: {
    fontSize: 12,
    color: '#808080',
  },
  container2: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: null,
    backgroundColor: '#FFFFFF'
  },
  backdrop: {
    paddingTop: 60,
    width: '100%',
    height: 300
  },
  backdropView: {
    height: 230,
    width: 380,
    backgroundColor: 'rgba(0,0,0,0)',
    paddingLeft: 15
  },
  positionheadline: {
    fontSize: 18,
    fontWeight: '100',
    paddingTop: 5,
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white'
  },

  companyheadline: {
    fontSize: 16,
    fontWeight: '100',
    paddingTop: 5,
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white'
  },

  locationheadline: {
    fontSize: 14,
    fontWeight: '100',
    paddingTop: 5,
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white'
  },

});
