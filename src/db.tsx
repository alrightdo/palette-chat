'use client'

import React, { useEffect, createContext, useContext } from 'react';
import { id, init, tx } from '@instantdb/react';


const APP_ID = 'b624ebb3-5c3d-4416-87f2-24005d41aeb5';
type Schema = {
    "channel": {
        "name": string,
    },
    "post": {
        "file_id": string,
        "message": string,
        "created_at": string,
        "mux_id": string,
    },
    "project": {
        "name": string,
    },
    "profile": {
        "name": string,
        "user_id": string,
        "color": string,
    },
}

export const db = init<Schema>({ appId: APP_ID });

// Create a context for the user profile
const ProfileContext = createContext<{ profile: any | null, isLoading: boolean }>({ profile: null, isLoading: true });

// Create a ProfileProvider component
export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = db.useAuth();
    const { isLoading, error, data } = db.useQuery(user ? { profile: { $: { where: { user_id: user.id } } } } : null);

    useEffect(() => {
        if (isLoading) return;
        if (!user) return;
        if (error) return;
        if (data.profile[0]) return;

        const pastelColors = [
            "#FFB3BA", // Light Pink
            "#BAFFC9", // Light Mint
            "#BAE1FF", // Light Sky Blue
            "#FFFFBA", // Light Yellow
            "#FFDFBA", // Light Peach
            "#E0BBE4", // Light Lavender
            "#D4F0F0", // Light Cyan
            "#FFC6FF"  // Light Magenta
        ];

        // Generate a hash from the user ID
        const hashCode = (str: string) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32-bit integer
            }
            return Math.abs(hash);
        };

        // Use the hash to select a consistent color
        const colorIndex = hashCode(user.id) % pastelColors.length;
        const color = pastelColors[colorIndex];

        db.transact(tx.profile[id()].update({ user_id: user.id, email: user.email, color }));
    }, [isLoading, user, data]);

    const profile = data?.profile[0] || null;

    return (
        <ProfileContext.Provider value={{ profile, isLoading }}>
            {children}
        </ProfileContext.Provider>
    );
};

// Custom hook to use the profile context
export const useProfile = () => useContext(ProfileContext);