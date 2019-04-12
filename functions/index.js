const { Expo } = require('expo-server-sdk')
const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase);

exports.sendPushNotification = functions.database.ref('Events/{id}').onCreate(event => {
  let expo = new Expo();
  const messages = [];

  return admin.database().ref('Users').once('value').then(snapshot => {
    snapshot.forEach((childSnapshot) => {
      const expoToken = childSnapshot.val().notificationToken;
      if(expoToken && childSnapshot.val().firstName === "Connor" && childSnapshot.val().lastName === "McDonald") {
        let title = event.data.val().eventTitle;

        messages.push({
          to: expoToken,
          title: "New Event Added",
          body: title
        });
      }
    });

    let chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
      try {
        expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        console.error(error);
      }
    }
  });
});

exports.getEventData = functions.https.onRequest((req, res) => {
  let events = req.query.events;
  if(events) {
    if(!Array.isArray(events)) {
      let eventID = events;
      events = [];
      events.push(eventID);
    }

    let eventData = [];

    for(let event in events) {
      admin.database().ref("Events/" + events[event]).once('value').then((snapshot) => {
        if(snapshot.exists() && snapshot.val().eventTitle && snapshot.val().whooshBits && snapshot.val().eventDate) {
          let data = {
            eventTitle: snapshot.val().eventTitle,
            whooshBits: snapshot.val().whooshBits,
            eventDate: snapshot.val().eventDate
          }
          eventData.push(data);
          if(event == events.length - 1) {
            res.send(eventData);
          }
        }
      });
    }
  } else {
    res.send([]);
  }
});
