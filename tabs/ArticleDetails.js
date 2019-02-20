/**
 * JonssonConnect Article Details Page
 * https://github.com/mendoza-git/JonssonConnect
 * @flow
 */

 import React, { Component } from 'react';
 import { ActivityIndicator, Image, ListView, StyleSheet, View } from 'react-native';
 import { Container,Content,CardItem, Icon, Text, Body } from 'native-base';

 export default class ArticleDetails extends Component {

     constructor(props) {
         super(props);

         this.state = {
             isLoading: true
         }
     }

     componentDidMount() {
         this.fetchArticle()
     }

     fetchArticle = () => {
         return fetch('https://jonssonconnect.firebaseio.com/Articles.json')
             .then((response) => response.json())
             .then((responseJson) => {

                 let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

                 this.setState({
                     isLoading: false,
                     dataSource: ds.cloneWithRows(responseJson),
                 });

             })
             .catch((error) => {
                 console.error(error);
             });
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
             <Container>
                 <Content>
                     <Image source={ {uri: this.props.navigation.state.params.item[1].articleImageURL} }  style={{ height: 300 }}></Image>

                     <CardItem>
                         <Body>
                         <Text style={styles.articleNameStyle}>{this.props.navigation.state.params.item[1].articleName}</Text>
                         <Text style={{fontSize: 14, fontWeight: '800'}}></Text>
                         <Text style={{fontSize: 14, color: '#808080',}}><Icon type='SimpleLineIcons'  name='clock' style={{ fontSize: 14}}/> Published on {
                             new Date(this.props.navigation.state.params.item[1].postedOn).toLocaleDateString("en-US", { month:'short', day:'numeric', year:'numeric' })
                         }</Text>
                         {/* <Text style={{fontSize: 12, fontWeight: '100', color: "#b6b6b6",}}>_____________________________________________________________</Text> */}
                         <Text style={styles.contentStyle}>{'\n\n\t\t\t\t\t' + this.props.navigation.state.params.item[1].articleContent + '\n\n'}</Text>
                         <Text style={{fontSize: 10, fontWeight: '100', color:'#b6b6b6', alignSelf: 'center'}}> --- End of News Article ---</Text>
                         </Body>
                     </CardItem>

                 </Content>
             </Container>
         )
     }
 }

const styles = StyleSheet.create({
    articleNameStyle: {
        fontWeight: '800',
        fontSize: 24,
    },
    contentStyle: {
        fontWeight: '300',
        fontSize: 15,
    },
    nameStyle: {
        fontWeight: '600',
        fontSize: 16,
    },
    descriptionStyle: {
        fontWeight: '400',
        fontSize: 12,
    },
    hostStyle: {
        fontSize: 12,
        color: '#808080',
    },
    eventNameStyle: {
        fontSize: 12,
    },
    eventDescriptionStyle: {
        fontSize: 10,
    },
    buttonStyle: {
        fontSize: 12,
    },
    search: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
    searchbarColor: {
        backgroundColor: '#0039A6',
    },
    searchButton: {
        fontSize: 12,
        color: '#ffffff',
    },
});
