// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdVrszffTUjs-xi1kNex4wpSTjULR7jak",
  authDomain: "project1-b4162.firebaseapp.com",
  projectId: "project1-b4162",
  storageBucket: "project1-b4162.appspot.com",
  messagingSenderId: "551144010276",
  appId: "1:551144010276:web:dd2dcc606a70fe5ad81eb1",
  measurementId: "G-PRDX3C0XDN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export default app;