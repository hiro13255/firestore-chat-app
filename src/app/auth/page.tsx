"use client";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/auth";
import { login, logout } from "@/lib/auth";

export const Auth = () => {
    const user = useAuth();

    const [waiting, setWaiting] = useState<boolean>(false);

    const signIn = () => {
        setWaiting(true);

        login()
            .catch((error: unknown) => {
                console.error(error);
            })
            .finally(() => {
                setWaiting(false);
            });
    };

    useEffect(() => {
        console.log(user);
    }, [waiting]);

    return (
        <div>
            {!user && !waiting && <button onClick={signIn}>ログイン</button>}
            {!user && waiting && <p>Waiting...</p>}
            {user && (
                <>
                    <p style={{ color: "white" }}>{user.name}</p>
                    <button onClick={logout}>ログアウト</button>
                </>
            )}
        </div>
    );
};

export default Auth;
