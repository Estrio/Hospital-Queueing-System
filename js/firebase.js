import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getFirestore
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyD9aKrEgAGdQP_desoHHIkXSl0KQeVHuOs",

  authDomain:
    "tch-queueing-system.firebaseapp.com",

  projectId:
    "tch-queueing-system",

  storageBucket:
    "tch-queueing-system.appspot.com",

  messagingSenderId:
    "608981748778",

  appId:
    "1:608981748778:web:c9b30352120ee704780753"
};

const app =
  initializeApp(firebaseConfig);

export const db =
  getFirestore(app);