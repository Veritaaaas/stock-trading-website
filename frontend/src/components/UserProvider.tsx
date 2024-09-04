'use client'
import { db } from "../firebase/config";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config"; 
import { createContext, useContext, useEffect, useState } from 'react';

interface UserData {
    uid: string;
    username: string;
    cash: number;
    firstName: string;
    lastName: string;
}

const UserContext = createContext<UserData | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user] = useAuthState(auth);
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        console.log(user, 'user');
        const fetchUserData = async () => {
            if (user) {
                const usersCollectionRef = collection(db, 'users');
                const q = query(usersCollectionRef, where('uid', '==', user.uid)); 

                try {
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0];
                        setUserData(userDoc.data() as UserData);
                    } else {
                        console.log('No user document found');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, [user]); 

    return (
        <UserContext.Provider value={userData}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}