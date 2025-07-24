import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { DatabaseData } from '../@types/Database';
import app from '../firebase';

const defaultDatabaseData: DatabaseData = {
  categories: [],
  haircuts: [],
  daily_reports: []
};

const DatabaseContext = createContext<DatabaseData>(defaultDatabaseData);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<DatabaseData>(defaultDatabaseData);
    const [uid, setUid] = useState<string | null>(null);

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);
            } else {
                setUid(null); // usuário deslogado
                setData(defaultDatabaseData); // limpa dados quando desloga
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!uid) return;

        const database = getDatabase(app);
        const userRef = ref(database, `users/${uid}`);

        const unsubscribe = onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                setData(userData);
            } else {
                setData(defaultDatabaseData);
                console.log("Usuário sem dados salvos.");
            }
        }, (error) => {
            console.error("Erro ao buscar dados do usuário:", error);
        });

        return () => unsubscribe();
    }, [uid]);

    return (
        <DatabaseContext.Provider value={data}>
            {children}
        </DatabaseContext.Provider>
    );
};

export const useDatabaseContext = () => {
    return useContext(DatabaseContext);
};
