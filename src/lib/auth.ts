import { GoogleAuthProvider, signInWithRedirect, signOut } from "firebase/auth";
import { auth } from "./firebase";

export const login = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithRedirect(auth, provider);
};

export const logout = () => {
  return signOut(auth);
};
