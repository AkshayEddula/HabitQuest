import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase/config';

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Subscribe to auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoading(false);
        });

        // Cleanup subscription
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuth() {
    return useContext(AuthContext);
}
