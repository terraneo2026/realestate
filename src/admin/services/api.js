import { getDoc, doc, collection, getDocs, query, where, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * Fetch Web Settings from Firestore
 * Equivalent to /api/web-settings
 */
export const getWebSettings = async () => {
  const docRef = doc(db, "settings", "main");
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return snapshot.data();
  } else {
    throw new Error("Settings not found");
  }
};

/**
 * Fetch Homepage Data from Firestore
 * Equivalent to /api/homepage-data
 */
export const getHomepageData = async () => {
  const docRef = doc(db, "homepage", "main");
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return snapshot.data();
  } else {
    throw new Error("Homepage data not found");
  }
};

/**
 * Fetch Properties from Firestore
 */
export const getProperties = async (filters = {}) => {
  let q = collection(db, "properties");
  
  if (filters.category) {
    q = query(q, where("category_id", "==", filters.category));
  }
  
  if (filters.status !== undefined) {
    q = query(q, where("status", "==", filters.status));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Add Property (Admin Only - security rules will handle this)
 */
export const addProperty = async (data) => {
  return await addDoc(collection(db, "properties"), {
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
};

/**
 * Update Property
 */
export const updateProperty = async (id, data) => {
  const docRef = doc(db, "properties", id);
  return await updateDoc(docRef, {
    ...data,
    updated_at: new Date().toISOString()
  });
};

/**
 * Delete Property
 */
export const deleteProperty = async (id) => {
  const docRef = doc(db, "properties", id);
  return await deleteDoc(docRef);
};
