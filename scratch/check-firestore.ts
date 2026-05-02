import { firestore } from "./src/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

async function check() {
  const snap = await getDocs(collection(firestore, "categories"));
  console.log("Categories count:", snap.size);
  snap.forEach(doc => console.log(doc.id, doc.data()));
  process.exit(0);
}

check();
