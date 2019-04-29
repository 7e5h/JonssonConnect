import React, { Component } from 'react';
import PushNotification from 'react-native-push-notification';
import { PushNotificationIOS } from 'react-native';

//Class is basis for any notification creation
export default class RSVPNotifService {
    constructor(){}

    //must configure
    configure() {
        PushNotification.configure({
            onNotification: function(notification) {
                //Log notification on touch/recieve for now
                console.log('NOTIFICATION: ', notification);
                
                //Required for IOS only
                notification.finish(PushNotificationIOS.fetchResult.NoData);
            },

            //IOS only
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },

            popInitialNotification: true,

            requestPermissions: true,
        });
    }

}