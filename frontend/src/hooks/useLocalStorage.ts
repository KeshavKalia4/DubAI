'use client';
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialVal: T): [T, (value: T) => void, boolean] {
    // Always start with initialVal to match server render
    const [storedVal, setStoredVal] = useState<T>(initialVal);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage after mount (client-side only)
    useEffect(() => {
        try {
            const item = localStorage.getItem(key);
            if (item) {
                setStoredVal(JSON.parse(item));
            }
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
        }
        setIsLoaded(true);
    }, [key]);

    // Save to localStorage when value changes (after initial load)
    useEffect(() => {
        if (!isLoaded) return;
        try {
            if (storedVal == null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, JSON.stringify(storedVal));
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedVal, isLoaded]);
    return [storedVal, setStoredVal, isLoaded];
}
