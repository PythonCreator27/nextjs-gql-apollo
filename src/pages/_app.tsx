import type { AppProps } from 'next/app';
import '../styles/tailwind.scss';
import { NavBar } from '../components/Navigation/NavBar';
import { useRouter } from 'next/router';
import AuthContextProvider from '../authContext';
import { ApolloWrapper } from '../components/Wrappers/ApolloWrapper';
import { ErrorWrapper } from '../components/Wrappers/ErrorWrapper';
import ErrorContextProvider from '../errorContext';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <ErrorContextProvider>
            <ErrorWrapper>
                <AuthContextProvider>
                    <ApolloWrapper>
                        <NavBar />
                        <Component {...pageProps} />
                    </ApolloWrapper>
                </AuthContextProvider>
            </ErrorWrapper>
        </ErrorContextProvider>
    );
};

export default MyApp;
