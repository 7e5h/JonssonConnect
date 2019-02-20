const functions = require('firebase-functions');
var fetch = require('node-fetch')

const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase);

exports.sendPushNotification = functions.database.ref('Events/{id}').onCreate(event => {

    const root = event.data.ref.root
    var messages = []

    //return the main promise
    return root.child('/Users').once('value').then(function (snapshot) {

        snapshot.forEach(function (childSnapshot) {

            var expoToken = childSnapshot.val().notificationToken;

            if (expoToken) {

                messages.push({
                    "to": expoToken,
                    "body": "New Event Added"
                })
            }
        })

        return Promise.all(messages)

    }).then(messages => {

        fetch('https://exp.host/--/api/v2/push/send', {

            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(messages)
        })
        return true;
    })
})
