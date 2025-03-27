import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from '../config/firebase';

export const saveFirestoreDb = async (data: any, userId: string) => {
    try {
      await setDoc(doc(db, 'applications', userId), {...data,applicantId:userId}, { merge: true });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  export const uploadFirestorage = async (file: File, folder: string, userId: string): Promise<string | null> => {
      const storage = getStorage();
      const fileExtension = file.name.split(".").pop();
      const fileName = `${folder}/${userId}/${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, fileName);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("Failed to upload file");
      }
    };

