const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyD-...", // I'll get this from src/lib/firebase.ts
  authDomain: "relocatebiz-ff841.firebaseapp.com",
  projectId: "relocatebiz-ff841",
  storageBucket: "relocatebiz-ff841.appspot.com",
  messagingSenderId: "331899933568",
  appId: "1:331899933568:web:7863487f7a77d70c99543e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  try {
    const snap = await getDocs(collection(db, "categories"));
    console.log("Categories count:", snap.size);
    snap.forEach(doc => console.log(doc.id, doc.data().name));
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}

check();
