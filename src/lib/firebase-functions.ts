import { db, storage } from "./firebase";
import { collection, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { ContentType } from "@/lib/types";

// Upload a file to Firebase Storage
async function uploadFile(file: File) {
  // Create a reference in Storage (will auto-create folder)
  const fileRef = ref(storage, `Reels/${file.name}`);

  // Upload file
  await uploadBytes(fileRef, file);

  // Get a public download URL
  const url = await getDownloadURL(fileRef);
  return url;
}
// Save content to Firestore
export async function saveContentToFirebase(type: ContentType, data: Record<string, any>) {
  try {
    const colRef = collection(db, type);

    // Handle file uploads
    const processedData: Record<string, any> = { ...data };
    for (const key in data) {
      if (data[key] instanceof File) {
        processedData[key + "Url"] = await uploadFile(data[key], type);
        delete processedData[key];
      }
    }

    await addDoc(colRef, {
      ...processedData,
      createdAt: new Date(),
    });

    console.log(`${type} content saved successfully.`);
  } catch (err) {
    console.error("Error saving content:", err);
  }
}

export async function deleteContent(type: string, id: string) {
  const docRef = doc(db, type, id);
  await deleteDoc(docRef);
}

// Update a document
export async function updateContent(type: string, id: string, data: Record<string, any>) {
  const docRef = doc(db, type, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date(),
  });
}
