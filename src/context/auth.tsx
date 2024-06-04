import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

import { auth, db } from "@/lib/firebase";
import { User } from "@/types/user";

type UserContextType = User | null | undefined;

const AuthContext = createContext<UserContextType>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
      }

      if (firebaseUser) {
        const userRef = doc(db, `users/${firebaseUser.uid}`);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const appUser = snap.data() as User;
          setUser(appUser);
        } else {
          const appUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "匿名ユーザー",
          };

          void setDoc(userRef, appUser)
            .then(() => {
              setUser(appUser);
            })
            .catch(() => {
              console.error("Failed to set document");
            });
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
