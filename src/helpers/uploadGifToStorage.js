import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadGifToFirebaseStorage = async (blob) => {
  try {
    const storageRef = ref(storage, `gifs/generated-${Date.now()}.gif`);
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Error al subir el GIF a Firebase Storage:", error);
    return "error";
  }
};
