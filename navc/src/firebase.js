// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZba78_O69v9ZtvYfNTUz4os2l8XUojqU",
  authDomain: "project-1-928cb.firebaseapp.com",
  projectId: "project-1-928cb",
  storageBucket: "project-1-928cb.appspot.com",
  messagingSenderId: "571198985976",
  appId: "1:571198985976:web:68a308431145512609cd0d",
  measurementId: "G-GL1ZG2MSS4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db=getFirestore(app);
export default app;