import React , { Component } from 'react'; 
import { Card, Text } from 'native-base';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

import UsersAttendingItem from './UsersAttendingItem.js'; 

export default class UsersAttendingList extends Component {

    constructor(props) {
        super(props); 

        this.state = {
            userList: {},
        }; 
    }

    openSeeAll = () => {
        console.log('This is where you open the see all screen'); 
    }

    render() {
        return (
            <Card style={styles.card}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.title}>Attending</Text>
                    <TouchableOpacity onPress={() => {this.openSeeAll();}} style={styles.seeAll}><Text>See All</Text></TouchableOpacity>
                </View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                    {this.props.usersRsvpList.map(userId => {
                        return <UsersAttendingItem userId={userId}/>
                    })}
                </ScrollView>
            </Card>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        height: 200,
    },
    title: {
        padding: 10,
        fontSize: 26, 
        fontWeight: '800',
        flex: 1,
    },
    seeAll: {
        padding: 10,
        alignSelf: 'center', 
    },
    scrollView: {
        flex: 1, 
    },
 });