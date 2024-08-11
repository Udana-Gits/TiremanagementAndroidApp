// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';

// admin.initializeApp();

// const db = admin.database();

// exports.sendDailyNotifications = functions.pubsub.schedule('0 8 * * 1-5').timeZone('America/New_York').onRun(async (context) => {
//   const tiresToCheck = await getTiresToCheck();

//   if (tiresToCheck.length > 0) {
//     const payload: admin.messaging.MessagingPayload = {
//       notification: {
//         title: 'Tire Check Reminder',
//         body: 'Please check the tire details of the assigned vehicles today.',
//         sound: 'default',
//       },
//     };

//     const employeeTokens = await getEmployeeTokens();
//     if (employeeTokens.length > 0) {
//       await admin.messaging().sendToDevice(employeeTokens, payload);
//       console.log('Notifications sent to employees.');
//     }
//   }

//   return null;
// });

// async function getTiresToCheck(): Promise<any[]> {
//   const snapshot = await db.ref('TireData').orderByChild('status').equalTo('unchecked').once('value');
//   const tires = [];
//   snapshot.forEach(childSnapshot => {
//     tires.push(childSnapshot.val());
//   });
//   return tires;
// }

// async function getEmployeeTokens(): Promise<string[]> {
//   const snapshot = await db.ref('UserauthList').orderByChild('occupation').equalTo('employee').once('value');
//   const tokens = [];
//   snapshot.forEach(childSnapshot => {
//     const token = childSnapshot.val().fcmToken;
//     if (token) {
//       tokens.push(token);
//     }
//   });
//   return tokens;
// }
