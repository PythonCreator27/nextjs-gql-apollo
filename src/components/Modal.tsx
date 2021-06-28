import ReactDOM from 'react-dom';

export const Modal: React.FC<{ show: boolean; close: () => void }> = ({
    show,
    children,
    close,
}) => {
    if (!show) return <></>;

    return ReactDOM.createPortal(
        <>
            <div
                className="fixed flex items-center justify-center overflow-auto z-40 bg-black opacity-40 left-0 top-0 bottom-0 right-0"
                onClick={close}
            />
            <div className="absolute bg-white rounded-md shadow-lg p-6 flex z-50 overflow-auto m-auto top-0 left-0 bottom-0 right-0 w-60 h-32">
                <div className="flex flex-col m-auto">
                    <div>{children}</div>
                    <button
                        className="bg-blue-900 text-white rounded-md shadow px-2 py-1 mt-5 m-auto"
                        onClick={close}
                    >
                        OK
                    </button>
                </div>
            </div>
        </>,
        document.body
    );
};
