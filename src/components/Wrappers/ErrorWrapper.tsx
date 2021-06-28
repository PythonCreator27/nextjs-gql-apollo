import { useContext } from 'react';
import { ErrorContext } from '../../errorContext';
import { Modal } from '../Modal';

export const ErrorWrapper: React.FC = ({ children }) => {
    const { error, clearError } = useContext(ErrorContext);
    return (
        <>
            <Modal close={clearError} show={!!error}>
                {error}
            </Modal>
            {children}
        </>
    );
};
