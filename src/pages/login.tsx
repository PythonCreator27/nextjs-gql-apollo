import { NextPage } from 'next';
import { useLoginMutation } from '../generated/gql';
import { Formik, Form } from 'formik';
import { ApolloError } from '@apollo/client';
import FormInput from '../components/FormInput';
import { Link } from '../components/Navigation/Link';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../authContext';
import { ErrorContext } from '../errorContext';

export const Login: NextPage = () => {
    const [login] = useLoginMutation();
    const {
        login: ctxLogin,
        authState: { token },
    } = useContext(AuthContext);
    const { setError } = useContext(ErrorContext);
    const router = useRouter();

    useEffect(() => {
        if (token) {
            router.push('/');
        }
    }, [token, router]);

    return (
        <>
            <h1 className="text-6xl font-semibold text-center m-8">Login</h1>
            <Formik
                initialValues={{ usernameOrEmail: '', password: '' }}
                onSubmit={async values => {
                    try {
                        const { data } = await login({ variables: values });
                        if (data) {
                            ctxLogin(data.login.token, data.login.user.id);
                            router.push('/');
                        }
                    } catch (err) {
                        if (err instanceof ApolloError) {
                            setError('Failed to login, check your credentials.');
                        } else {
                            throw err;
                        }
                    }
                }}
            >
                {({ handleBlur, handleChange, values, isSubmitting }) => (
                    <div className="max-w-xs m-auto bg-blue-200 py-5 px-5 rounded-xl">
                        <Form className="p-5 text-blue-800">
                            <FormInput
                                label="Username or Email"
                                name="usernameOrEmail"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.usernameOrEmail}
                            />
                            <FormInput
                                name="password"
                                type="password"
                                label="Password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="block m-auto mt-5 text-center px-3 py-2 bg-blue-800 transition duration-200 ease-in-out text-white hover:bg-blue-400 rounded-[0.25rem] leading-tight focus:ring !outline-none w-full"
                            >
                                Submit
                            </button>
                            <Link href="/register" className="mt-3">
                                Need an account? Register
                            </Link>
                        </Form>
                    </div>
                )}
            </Formik>
        </>
    );
};
export default Login;
