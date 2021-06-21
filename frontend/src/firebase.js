import firebase from 'firebase/app'
import "firebase/auth"
require('firebase/database');
require('firebase/firestore');


var config = {
    apiKey: "AIzaSyAUmV5jYXoHk0D8uPsXiMlXfFOJ6gGU6nA",
    authDomain: "authtest-691d4.firebaseapp.com",
    projectId: "authtest-691d4",
    storageBucket: "authtest-691d4.appspot.com",
    messagingSenderId: "367817106337",
    appId: "1:367817106337:web:87eb11ba7cbb455327a1e0"
  
    }
const app = firebase.initializeApp(config)
export const auth = app.auth();
export const db = app.firestore();
export const admin = require('firebase-admin');


