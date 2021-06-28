import { InputHTMLAttributes } from 'react';
import { Input } from './Input';

const FormInput: React.FC<
    {
        mode?: 'bottom-border' | 'full-border';
        name: string;
        label: string;
        error?: string;
    } & InputHTMLAttributes<HTMLInputElement>
> = ({ mode = 'bottom-border', name, label, error, ...otherProps }) => {
    return (
        <div className="mb-7">
            <label htmlFor={name} className="text-blue-900 font-semibold">
                {label}
            </label>
            <Input
                className={`bg-gray-100 shadow-xl mt-3 ${
                    mode === 'bottom-border'
                        ? 'rounded-t-[0.25rem] border-b-2'
                        : mode === 'full-border'
                        ? 'rounded-[0.25rem] border-2'
                        : ''
                } border-blue-800 focus:bg-white max-w-full`}
                id={name}
                name={name}
                placeholder={label}
                {...otherProps}
            />
            <p className="text-sm text-red-600 text-semibold">{error}</p>
        </div>
    );
};

export default FormInput;
