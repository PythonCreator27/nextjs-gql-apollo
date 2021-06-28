import { NextPage } from 'next';
import { useRegisterMutation } from '../generated/gql';
import { Formik, Form } from 'formik';
import { ApolloError } from '@apollo/client';
import FormInput from '../components/FormInput';
import { Link } from '../components/Link';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../authContext';

export const Register: NextPage = () => {
    const [register] = useRegisterMutation();
    const {
        login: ctxLogin,
        authState: { token },
    } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (token) {
            router.push('/');
        }
    }, [token, router]);

    return (
        <>
            <h1 className="text-6xl font-semibold text-center m-8">Register</h1>
            <Formik
                initialValues={{ username: '', email: '', password: '' }}
                onSubmit={async (values, { setErrors }) => {
                    try {
                        const { data } = await register({ variables: values });
                        if (data) {
                            ctxLogin(data.register.token, data.register.user.id);
                            router.push('/');
                        }
                    } catch (err) {
                        if (err instanceof ApolloError) {
                            if (err.graphQLErrors[0].extensions) {
                                const exception =
                                    err.graphQLErrors[0].extensions.exception;
                                if (exception.validationErrors) {
                                    const error = exception.validationErrors[0];
                                    if (error) {
                                        const errorKey = Object.keys(
                                            error.constraints
                                        )[0];
                                        const finalError = error.constraints[errorKey];
                                        if (error.property === 'email') {
                                            setErrors({
                                                email: finalError,
                                            });
                                        } else if (error.property === 'username') {
                                            setErrors({
                                                username: finalError,
                                            });
                                        } else if (error.property === 'password') {
                                            setErrors({
                                                password: finalError,
                                            });
                                        }
                                    }
                                }
                            } else {
                                throw err;
                            }
                        }
                    }
                }}
            >
                {({ handleBlur, handleChange, values, isSubmitting, errors }) => (
                    <div className="max-w-xs m-auto bg-blue-200 py-5 px-5 rounded-xl">
                        <Form className="p-5 text-blue-800">
                            <FormInput
                                label="Username"
                                name="username"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.username}
                                error={errors.username || undefined}
                            />
                            <FormInput
                                label="Email Address"
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                type="email"
                                error={errors.email || undefined}
                            />
                            <FormInput
                                name="password"
                                type="password"
                                label="Password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
                                error={errors.password || undefined}
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="block m-auto mt-5 text-center px-3 py-2 bg-blue-800 transition duration-200 ease-in-out text-white hover:bg-blue-400 rounded-[0.25rem] leading-tight focus:ring !outline-none w-full"
                            >
                                Submit
                            </button>
                            <Link href="/login" className="mt-3">
                                Have an account? Login
                            </Link>
                        </Form>
                    </div>
                )}
            </Formik>
        </>
    );
};
export default Register;
