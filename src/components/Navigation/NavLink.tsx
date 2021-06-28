import { Link } from './Link';

export const NavLink: React.FC<{ href: string }> = ({ href, children }) => {
    return (
        <li>
            <Link
                href={href}
                className="no-underline py-2 px-3 bg-blue-100 rounded-md hover:bg-blue-200 transition focus:ring"
            >
                {children}
            </Link>
        </li>
    );
};
