import { InputHTMLAttributes } from 'react';

export const Input: React.FC<
    {
        isFull?: boolean;
        rounded?: boolean;
        className?: string;
    } & InputHTMLAttributes<HTMLInputElement>
> = ({ isFull, rounded, className, ...inputProps }) => {
    return (
        <input
            className={`p-2 my-2 outline-none ${className ?? ''} ${
                isFull ? 'focus:ring border' : ''
            } ${rounded ? 'rounded-md' : ''}`}
            {...inputProps}
        />
    );
};
