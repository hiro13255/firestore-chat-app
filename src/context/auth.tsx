import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

import { auth, db } from "@/lib/firebase";
import { User } from "@/types/user";

type UserContextType = User | null | undefined;

const AuthContext = createContext<UserContextType>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserContextType>(undefined);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log("ddd");
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

                    setDoc(userRef, appUser)
                        .then(() => {
                            setUser(appUser);
                        })
                        .catch(() => {
                            console.error("Failed to set document");
                        });
                }
            } else {
                setUser(null);
            }
        });
        return unsubscribe;
    }, []);

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
