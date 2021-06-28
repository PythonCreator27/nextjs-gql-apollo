import { createContext, useEffect, useState } from 'react';

export const ErrorContext = createContext<{
    error: string | null;
    setError: (newVal: string) => void;
    clearError: () => void;
}>({ error: null, clearError: () => {}, setError: () => {} });

export const ErrorContextProvider: React.FC = ({ children }) => {
    const [errorState, setErrorState] = useState<string | null>(null);

    return (
        <ErrorContext.Provider
            value={{
                error: errorState,
                clearError: () => setErrorState(null),
                setError: setErrorState,
            }}
        >
            {children}
        </ErrorContext.Provider>
    );
};

export default ErrorContextProvider;
