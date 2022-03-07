// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCw74DPrmG7K_ttXgN9sXiFr9-2Hx3T8wc",
  authDomain: "jared-teams.firebaseapp.com",
  databaseURL: "https://jared-teams-default-rtdb.firebaseio.com",
  projectId: "jared-teams",
  storageBucket: "jared-teams.appspot.com",
  messagingSenderId: "1006436002902",
  appId: "1:1006436002902:web:48f943368c05692cff9ff7"
};

// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);

export const projectAuth = app.auth();

export const projectFirestore = app.firestore();

export const projectStorage = app.storage();

export const timestamp = firebase.firestore.Timestamp;