import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import { useContext } from 'react';
import { AuthContext } from '../../authContext';

export const ApolloWrapper: React.FC = ({ children }) => {
    const {
        authState: { token },
    } = useContext(AuthContext);
    const client = new ApolloClient({
        ssrMode: typeof window === 'undefined',
        link: new HttpLink({
            uri: process.env.NEXT_PUBLIC_API_URI || 'http://localhost:4000/graphql',
            headers: token
                ? {
                      authorization: `Bearer ${token}`,
                  }
                : {},
        }),
        cache: new InMemoryCache(),
    });
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
