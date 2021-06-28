import firebase from 'firebase/app'
import "firebase/auth"
require('firebase/database');
require('firebase/firestore');


var config = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  
    }
const app = firebase.initializeApp(config)
export const auth = app.auth();
export const db = app.firestore();
export const admin = require('firebase-admin');


