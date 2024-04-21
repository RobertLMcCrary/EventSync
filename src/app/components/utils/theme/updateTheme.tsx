"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function useUserTheme() : [string, React.Dispatch<React.SetStateAction<string>>] {
    const { theme, setTheme } = useTheme();
    const [userTheme, setUserTheme] = useState<string>("");

    const setColorScheme = (e: { matches: any; }) => {
        if (e.matches) {
            // Dark
            setTheme('dark');
        } else {
            // Light
            setTheme('light');
        }
    }

    function detectTheme(setSystemTheme: (theme: string) => void) {
        const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        colorSchemeQueryList.addEventListener('change', setColorScheme);
        return colorSchemeQueryList.matches ? 'dark' : 'light';
    }

    useEffect(() => {
        console.log(userTheme);
        if (userTheme) {
            setTheme(userTheme);
        }
    }, [userTheme, setTheme]);

    return [userTheme, setUserTheme];
}