const initializeApp = require("firebase/app").initializeApp;
const getStorage = require("firebase/storage").getStorage;

const firebaseConfig = {
  apiKey: "AIzaSyC42PYuiRvdCiDMHtNxKlFCNfQSHTGs054",
  authDomain: "workout-images-86fd7.firebaseapp.com",
  projectId: "workout-images-86fd7",
  storageBucket: "workout-images-86fd7.appspot.com",
  messagingSenderId: "763824684511",
  appId: "1:763824684511:web:55c6a75f8daa86801cd86a",
  measurementId: "G-9M3D0SWKD3",
};

const app = initializeApp(firebaseConfig);
module.exports = { storage: getStorage(app) };
