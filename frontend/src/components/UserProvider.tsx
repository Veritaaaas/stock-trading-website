'use client'
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot } from 'firebase/firestore';
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

interface PortfolioData {
    uid: string;
    symbol: string;
    name: string;
    shares: number;
}

interface UserContextData {
    userData: UserData | null;
    portfolioData: PortfolioData[] | null;
}

const UserContext = createContext<UserContextData | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user] = useAuthState(auth);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [portfolioData, setPortfolioData] = useState<PortfolioData[] | null>(null);

    useEffect(() => {
        console.log(user, 'user');
        let unsubscribeUser: (() => void) | undefined;
        let unsubscribePortfolio: (() => void) | undefined;

        const fetchUserData = async () => {
            if (user) {
                const usersCollectionRef = collection(db, 'users');
                const q = query(usersCollectionRef, where('uid', '==', user.uid)); 

                unsubscribeUser = onSnapshot(q, (querySnapshot) => {
                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0];
                        setUserData(userDoc.data() as UserData);
                    } else {
                        console.log('No user document found');
                    }
                }, (error) => {
                    console.error('Error fetching user data:', error);
                });
            }
        };

        const fetchPortfolioData = async () => {
            if (user) {
                const portfolioCollectionRef = collection(db, 'portfolio');
                const q = query(portfolioCollectionRef, where('uid', '==', user.uid)); 

                unsubscribePortfolio = onSnapshot(q, (querySnapshot) => {
                    if (!querySnapshot.empty) {
                        const portfolioData: PortfolioData[] = [];
                        querySnapshot.forEach((doc) => {
                            portfolioData.push(doc.data() as PortfolioData);
                        });
                        setPortfolioData(portfolioData);
                    } else {
                        console.log('No portfolio data found');
                    }
                }, (error) => {
                    console.error('Error fetching portfolio data:', error);
                });
            }
        };

        fetchUserData();
        fetchPortfolioData();

        return () => {
            if (unsubscribeUser) {
                unsubscribeUser();
            }
            if (unsubscribePortfolio) {
                unsubscribePortfolio();
            }
        };
    }, [user]); 

    return (
        <UserContext.Provider value={{ userData, portfolioData }}>
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