import { useContext, useState } from 'react';
import { Input } from './Input';
import {
    Todo as TodoModel,
    useDeleteTodoMutation,
    useToggleDoneMutation,
    useUpdateTextMutation,
} from '../generated/gql';
import { ErrorContext } from '../errorContext';

const Todo: React.FC<{ todo: TodoModel }> = ({ todo }) => {
    const [toggleDone] = useToggleDoneMutation();
    const [deleteTodo] = useDeleteTodoMutation({
        update(cache) {
            const id = cache.identify({ id: todo.id, __typename: 'Todo' });
            cache.evict({ id });
            cache.gc();
        },
    });
    const { setError } = useContext(ErrorContext);
    const [updateTodoText] = useUpdateTextMutation();
    const [updateMode, setUpdateMode] = useState(false);
    const [updatedText, setUpdatedText] = useState(todo.text);
    return (
        <li key={todo.id} className="shadow p-5 m-5 flex justify-between">
            <div className="flex space-x-5 items-center">
                <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={async () => {
                        try {
                            await toggleDone({
                                variables: { done: !todo.done, id: todo.id },
                            });
                        } catch {
                            setError(
                                `Failed to make todo ${
                                    todo.done ? 'incomplete' : 'complete'
                                }.`
                            );
                        }
                    }}
                />
                {updateMode ? (
                    <Input
                        className="text-lg sm:text-xl my-0 outline-none rounded w-full"
                        value={updatedText}
                        onChange={e => setUpdatedText(e.target.value)}
                    />
                ) : (
                    <p
                        className={`${
                            todo.done ? 'line-through' : ''
                        } text-lg sm:text-xl p-2`}
                    >
                        {todo.text}
                    </p>
                )}
            </div>
            <div className="flex ml-5">
                {!updateMode ? (
                    <button
                        className="shadow p-2 focus:ring !outline-none rounded transition duration-200 focus:bg-yellow-200 bg-yellow-500 mr-2"
                        aria-label="Update todo"
                        onClick={() => setUpdateMode(true)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                    </button>
                ) : (
                    <>
                        <button
                            className="shadow p-2 focus:ring !outline-none rounded transition duration-200 focus:bg-green-200 bg-green-500 mr-2"
                            aria-label="Confirm update"
                            onClick={async () => {
                                try {
                                    await updateTodoText({
                                        variables: { id: todo.id, text: updatedText },
                                    });
                                    setUpdateMode(false);
                                } catch (err) {
                                    setError('Failed to update todo.');
                                }
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 stroke-current"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </button>
                        <button
                            className="shadow p-2 focus:ring !outline-none rounded transition duration-200 focus:bg-yellow-200 bg-yellow-400 mr-2"
                            aria-label="Update todo"
                            onClick={() => {
                                setUpdateMode(false);
                                setUpdatedText(todo.text);
                            }}
                        >
                            Cancel
                        </button>
                    </>
                )}
                <button
                    className="shadow p-2 focus:ring !outline-none rounded transition duration-200 focus:bg-red-200 bg-red-400"
                    aria-label="Delete todo"
                    onClick={async () => {
                        try {
                            await deleteTodo({ variables: { id: todo.id } });
                        } catch {
                            setError('Failed to delete todo.');
                        }
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 stroke-current fill-[none]"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                </button>
            </div>
        </li>
    );
};

export default Todo;
