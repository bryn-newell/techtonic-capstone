import firebase from 'firebase'
const config = {
  apiKey: "AIzaSyAAGTsP7VtqWGaalRXc1SjEqPai92CZ948",
  authDomain: "the-gift-of-giving.firebaseapp.com",
  databaseURL: "https://the-gift-of-giving.firebaseio.com",
  projectId: "the-gift-of-giving",
  storageBucket: "the-gift-of-giving.appspot.com",
  messagingSenderId: "212887170562"
};
firebase.initializeApp(config);
export default firebase;
