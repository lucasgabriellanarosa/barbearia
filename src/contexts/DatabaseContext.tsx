import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import type { DatabaseData } from '../@types/Database';
import app from '../firebase';

const DatabaseContext = createContext();

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [data, setData] = useState<DatabaseData>({
        categories: [],
        expenses: [],
        haircuts: [],
        daily_reports: [],
    });

    const database = getDatabase(app);

    const collectionRef = ref(database, "/");

    const fetchData = () => {
        onValue(collectionRef, (snapshot) => {
            if (snapshot.exists()) {
                const dataItem = snapshot.val();
                setData(dataItem);
            } else {
                console.log("No data available");
            }
        }, (error) => {
            console.error("Error fetching data: ", error);
        });
    };

    useEffect(() => {
        fetchData()
    }, [])
    
    return (
        <DatabaseContext.Provider value={data}>
            {children}
        </DatabaseContext.Provider>
    );
}

export const useDatabaseContext = () => {
    return useContext(DatabaseContext);
};