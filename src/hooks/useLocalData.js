import { useEffect, useRef, useState } from "react";
import useThrottleEffect from "./useThrottleEffect";

function setString(db, value) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("Database not initialized");

        const transaction = db.transaction("data-store", "readwrite");
        const store = transaction.objectStore("data-store");

        const request = store.put(value, "json");
        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            console.error("Error saving string:", event.target.errorCode);
            reject(event.target.errorCode);
        };
    });
}

function getString(db) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("Database not initialized");

        const transaction = db.transaction("data-store", "readonly");
        const store = transaction.objectStore("data-store");

        const request = store.get("json");
        request.onsuccess = () => {
            resolve(request.result || ""); // Default to an empty string if no value found
        };

        request.onerror = (event) => {
            console.error("Error retrieving string:", event.target.errorCode);
            reject(event.target.errorCode);
        };
    });
}

function useLocalData(key, initialState) {
    //  const [value, setValue] = useState(() => {
    //      const storedValue = localStorage.getItem(key);
    //      return storedValue !== null ? JSON.parse(storedValue) : initialState;
    //  });
    const [value, setValue] = useState(null);

    const [db, setDb] = useState(null);

    const handleSave = async () => {
        const newValue = JSON.stringify(value);

        if (db) {
            console.log("store save", db);
            await setString(db, newValue);
            // setStoredValue(newValue); // Update local state to reflect the saved value
        }
    };

    const handleLoad = async (db) => {
        if (db) {
            console.log("start load");
            const value = await getString(db);

            const newValue =
                value === "null" || value === "" || value === null
                    ? initialState
                    : JSON.parse(value);

            setValue(newValue);
            //  console.log("stored value", value);
            // setStoredValue(value); // Load from IndexedDB and update state
        } else {
            console.log("failed");
        }
    };

    useEffect(() => {
        const openRequest = indexedDB.open("letter-sleuth", 1);

        openRequest.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("data-store")) {
                db.createObjectStore("data-store");
            }
        };

        openRequest.onsuccess = (event) => {
            setDb(event.target.result);

            handleLoad(event.target.result);
        };

        openRequest.onerror = (event) => {
            console.error("Database error:", event.target.errorCode);
        };
    }, []);

    useThrottleEffect(
        () => {
            handleSave();
            // localStorage.setItem(key, JSON.stringify(value));
        },
        1500,
        [value]
    );

    return [value, setValue];
}

export default useLocalData;
