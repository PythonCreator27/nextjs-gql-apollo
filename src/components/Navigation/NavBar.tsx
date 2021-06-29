import { useRouter } from 'next/router';
import { useLogoutMutation, useMeQuery } from '../../generated/gql';
import { NavLink } from './NavLink';

export const NavBar = () => {
    const { data, refetch } = useMeQuery();
    const [logout] = useLogoutMutation();

    const router = useRouter();
    return (
        <div className="bg-blue-800 flex justify-center">
            <div className="flex p-5 justify-between container items-center">
                <p className="text-xl font-semibold text-white">GraphQLTodos</p>
                {data &&
                    (data.me != null ? (
                        <button
                            className="text-white focus:ring !outline-none p-2"
                            onClick={async () => {
                                await logout();
                                await refetch();
                                router.push('/login');
                            }}
                        >
                            Logout
                        </button>
                    ) : (
                        <NavLink href="/login">Login</NavLink>
                    ))}
            </div>
        </div>
    );
};
