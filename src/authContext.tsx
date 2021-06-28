import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext<{
    authState: { token?: string; expDate?: number; userId?: number };
    login: (token: string, userId: number) => void;
    logout: () => void;
    triedAutoLogin: boolean;
}>({
    authState: {},
    login: () => {},
    logout: () => {},
    triedAutoLogin: false,
});

export const AuthContextProvider: React.FC = ({ children }) => {
    const [authState, setAuthState] = useState<{
        token?: string;
        expDate?: number;
        userId?: number;
    }>({});
    const [triedAutoLogin, setTriedAutoLogin] = useState(false);
    const [timer, setTimer] = useState<number | undefined>();

    useEffect(() => {
        const userDataRaw = localStorage.getItem('userData');
        if (userDataRaw) {
            const userData: { userId: number; token: string; expDate: number } =
                JSON.parse(userDataRaw);
            if (userData.expDate - Date.now() > 0) {
                setAuthState(userData);
                setTimer(
                    window.setTimeout(() => {
                        setAuthState({});
                        localStorage.removeItem('userData');
                    }, userData.expDate - Date.now())
                );
            } else {
                localStorage.removeItem('userData');
            }
        }
        setTriedAutoLogin(true);
    }, []);

    const login = (token: string, userId: number) => {
        const expDate = Date.now() + 1000 * 60 * 59;

        localStorage.setItem('userData', JSON.stringify({ expDate, token, userId }));
        setAuthState({ expDate, token, userId });
        setTimer(
            window.setTimeout(() => {
                setAuthState({});
                localStorage.removeItem('userData');
            }, expDate - Date.now())
        );
    };

    const logout = () => {
        clearTimeout(timer);
        setTimer(undefined);
        localStorage.removeItem('userData');
        setAuthState({});
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout, triedAutoLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
