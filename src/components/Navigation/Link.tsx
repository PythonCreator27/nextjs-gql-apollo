import NextLink from 'next/link';

export const Link: React.FC<{ href: string; className?: string }> = ({
    href,
    className,
    children,
}) => {
    return (
        <NextLink href={href} passHref>
            <a className={`inline-block underline text-blue-800 ${className ?? ''}`}>
                {children}
            </a>
        </NextLink>
    );
};
