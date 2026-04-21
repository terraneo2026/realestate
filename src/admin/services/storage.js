import { storage } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

/**
 * Upload Image to Firebase Storage
 * Path: properties/{propertyId}/{fileName}
 */
export const uploadImage = async (path, file) => {
  const storageRef = ref(storage, path);
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return { url, path };
  } catch (error) {
    console.error("Storage Upload Error:", error);
    throw error;
  }
};

/**
 * Get Image URL from Storage
 */
export const getImageUrl = async (path) => {
  const storageRef = ref(storage, path);
  return await getDownloadURL(storageRef);
};

/**
 * Delete Image from Storage
 */
export const deleteImage = async (path) => {
  const storageRef = ref(storage, path);
  return await deleteObject(storageRef);
};
