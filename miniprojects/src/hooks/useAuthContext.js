import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import { projectStorage, projectFirestore } from "../firebase/config";

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error("useAuthContext must be used inside an AuthContextProvider");
  }

  const updateUserProfile = async (userData) => {
    try {
      const updates = { displayName: userData.displayName };
      if (userData.thumbnail) {
        const uploadPath = `thumbnails/${context.user.uid}/${userData.thumbnail.name}`;
        const img = await projectStorage.ref(uploadPath).put(userData.thumbnail);
        const imgURL = await img.ref.getDownloadURL();

        updates.photoURL = imgURL;
      }
      await context.user.updateProfile(updates);
  
      // create user document
      await projectFirestore
        .collection("users")
        .doc(context.user.uid)
        .set({ ...updates, online: true }, { merge: true });
      context.dispatch({ type: "SET_USER", payload: context.user });
    } catch(err) {
      console.log('err updating user data==>>', err);
    }
  };

  return { ...context, updateUserProfile };
};
