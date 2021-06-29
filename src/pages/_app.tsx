import type { AppProps } from 'next/app';
import '../styles/tailwind.scss';
import { NavBar } from '../components/Navigation/NavBar';
import { ErrorWrapper } from '../components/ErrorWrapper';
import ErrorContextProvider from '../errorContext';
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
        uri: process.env.NEXT_PUBLIC_API_URI || 'http://localhost:4000/graphql',
        credentials: 'include',
    }),
    cache: new InMemoryCache(),
});

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <ErrorContextProvider>
            <ErrorWrapper>
                <ApolloProvider client={client}>
                    <NavBar />
                    <Component {...pageProps} />
                </ApolloProvider>
            </ErrorWrapper>
        </ErrorContextProvider>
    );
};

export default MyApp;
