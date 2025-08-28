  // src/firebase.js
  import { initializeApp } from "firebase/app";
  import { getAuth } from "firebase/auth";
  import { getFirestore } from "firebase/firestore";

  // Your Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAw9l4BdjlQ1W1xJBQ4pm9beuY36bmmiVc",
    authDomain: "testing-580ef.firebaseapp.com",
    projectId: "testing-580ef",
    storageBucket: "testing-580ef.appspot.com",
    messagingSenderId: "431300826013",
    appId: "1:431300826013:web:82f5d47c9f1c36f57b9574",
    measurementId: "G-B2VE3FW6EJ"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  export { app, auth, db };
