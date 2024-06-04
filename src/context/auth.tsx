import { auth, db } from "@/lib/firebase";
import { User } from "@/types/user";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

type UserContextType = User | null | undefined;

const AuthContext = createContext<UserContextType>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
      }

      const userRef = doc(db, `users/${firebaseUser?.uid}`);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const appUser = snap.data() as User;
        setUser(appUser);
      } else {
        const appUser: User = {
          id: firebaseUser?.uid!,
          name: firebaseUser?.displayName!,
        };

        setDoc(userRef, appUser).then(() => setUser(appUser));
      }

      return unsubscribe;
    });
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
