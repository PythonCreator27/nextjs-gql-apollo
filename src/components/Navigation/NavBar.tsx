import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AuthContext } from '../../authContext';
import { NavLink } from './NavLink';

export const NavBar = () => {
    const {
        authState: { token },
        logout,
    } = useContext(AuthContext);
    const router = useRouter();
    return (
        <div className="bg-blue-800 flex justify-center">
            <div className="flex p-5 justify-between container items-center">
                <p className="text-xl font-semibold text-white">GraphQLTodos</p>
                <nav>
                    <ul className="flex items-center space-x-5">
                        {token !== undefined ? (
                            <>
                                <button
                                    className="text-white focus:ring !outline-none"
                                    onClick={() => {
                                        logout();
                                        router.push('/login');
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <NavLink href="/login">Login</NavLink>
                        )}
                    </ul>
                </nav>
            </div>
        </div>
    );
};
