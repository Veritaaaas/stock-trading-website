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

interface HistoryData {
    uid: string;
    name: string;
    price: number;
    shares: number;
    symbol: string;
    total: number;
    transaction: string;
    date: typeof Date;
}

interface BookmarkData {
    uid: string;
    symbol: string;
    name: string;
}

interface PerformanceData {
    uid: string;
    portfolioValue: number;
    date: typeof Date;
}


interface UserContextData {
    userData: UserData | null;
    portfolioData: PortfolioData[] | null;
    historyData: HistoryData[] | null;
    bookmarkData: BookmarkData[] | null;
    performanceData: PerformanceData[] | null;
}

const UserContext = createContext<UserContextData | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user] = useAuthState(auth);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [portfolioData, setPortfolioData] = useState<PortfolioData[] | null>(null);
    const [historyData, setHistoryData] = useState<HistoryData[] | null>(null);
    const [bookmarkData, setBookmarkData] = useState<BookmarkData[] | null>(null);
    const [performanceData, setPerformanceData] = useState<PerformanceData[] | null>(null);

    useEffect(() => {
        let unsubscribeUser: (() => void) | undefined;
        let unsubscribePortfolio: (() => void) | undefined;
        let unsubscribeHistory: (() => void) | undefined;
        let unsubscribeBookmark: (() => void) | undefined;
        let unsubscribePerformance: (() => void) | undefined;

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

        const fetchHistoryData = async () => {
            if (user) {
                const historyCollectionRef = collection(db, 'history');
                const q = query(historyCollectionRef, where('uid', '==', user.uid));

                unsubscribeHistory = onSnapshot(q, (querySnapshot) => {
                    if (!querySnapshot.empty) {
                        const historyData: HistoryData[] = [];
                        querySnapshot.forEach((doc) => {
                            historyData.push(doc.data() as HistoryData);
                        });
                        setHistoryData(historyData);
                    } else {
                        console.log('No history data found');
                    }
                }, (error) => {
                    console.error('Error fetching history data:', error);
                });
            }
        }

        const fetchBookmarkData = async () => {
            if (user) {
                const bookmarkCollectionRef = collection(db, 'bookmark');
                const q = query(bookmarkCollectionRef, where('uid', '==', user.uid));

                unsubscribeBookmark = onSnapshot(q, (querySnapshot) => {
                    if (!querySnapshot.empty) {
                        const bookmarkData: BookmarkData[] = [];
                        querySnapshot.forEach((doc) => {
                            bookmarkData.push(doc.data() as BookmarkData);
                        });
                        setBookmarkData(bookmarkData);
                    } else {
                        console.log('No bookmark data found');
                    }
                }, (error) => {
                    console.error('Error fetching bookmark data:', error);
                });
            }
        }

        const fetchPerformanceData = async () => {
            if (user) {
                const performanceCollectionRef = collection(db, 'performance');
                const q = query(performanceCollectionRef, where('uid', '==', user.uid));

                unsubscribePerformance = onSnapshot(q, (querySnapshot) => {
                    if (!querySnapshot.empty) {
                        const performanceData: PerformanceData[] = [];
                        querySnapshot.forEach((doc) => {
                            performanceData.push(doc.data() as PerformanceData);
                        });
                        setPerformanceData(performanceData);
                    } else {
                        console.log('No performance data found');
                    }
                }, (error) => {
                    console.error('Error fetching performance data:', error);
                });
            }
        }

        fetchUserData();
        fetchPortfolioData();
        fetchHistoryData();
        fetchBookmarkData();
        fetchPerformanceData();

        return () => {
            if (unsubscribeUser) {
                unsubscribeUser();
            }
            if (unsubscribePortfolio) {
                unsubscribePortfolio();
            }
            if (unsubscribeHistory) {
                unsubscribeHistory();
            }
            if (unsubscribeBookmark) {
                unsubscribeBookmark();
            }
            if (unsubscribePerformance) {
                unsubscribePerformance();
            }
        };
    }, [user]); 

    return (
        <UserContext.Provider value={{ userData, portfolioData, historyData, bookmarkData, performanceData }}>
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