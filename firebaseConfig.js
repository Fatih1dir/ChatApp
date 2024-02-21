// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence  } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCG2N125ei8-YEQGNpdgbgc4SU_mRQ5CcM",
  authDomain: "reactnativeprojects-e993c.firebaseapp.com",
  databaseURL: "https://reactnativeprojects-e993c-default-rtdb.firebaseio.com",
  projectId: "reactnativeprojects-e993c",
  storageBucket: "reactnativeprojects-e993c.appspot.com",
  messagingSenderId: "395506285582",
  appId: "1:395506285582:web:37f4d52775e0039d69105f",
  measurementId: "G-XDSS1KWTS8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase();
const firestore = getFirestore(app);
const storage = getStorage(app);

initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


export {app,database,firestore,storage};