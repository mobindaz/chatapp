// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoypfxWL5sPni_n89V1W4tVlvBZPWOJTE",
  authDomain: "chatapp-abcf4.firebaseapp.com",
  projectId: "chatapp-abcf4",
  storageBucket: "chatapp-abcf4.appspot.com",
  messagingSenderId: "11259113446",
  appId: "1:11259113446:web:cd3da6cb54c5a34bde3027"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();