const admin = require('firebase-admin');
const serviceAccount = require('../../path/to/your/serviceAccountKey.json'); // Update the path to your service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<YOUR-FIREBASE-PROJECT-ID>.firebaseio.com" // Replace with your Firebase project ID
});

module.exports = admin;