import firebase from "firebase";
import "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDgmpu83h_bfiGGOuL-HjBkWQQ_VFeLh3I",
  authDomain: "learn-firebase-masalib-2d36d.firebaseapp.com",
  projectId: "learn-firebase-masalib-2d36d",
  storageBucket: "learn-firebase-masalib-2d36d.appspot.com",
  messagingSenderId: "221892397009",
  appId: "1:221892397009:web:61dd84b032bea9cb2b42f0",
  measurementId: "G-WZ86K7H3N2"
};


firebase.initializeApp(firebaseConfig);

var auth_obj = firebase.auth();
export default firebase;
export const auth = auth_obj;