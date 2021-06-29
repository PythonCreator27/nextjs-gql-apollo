import { gql } from '@apollo/client';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { ErrorMessage } from '../components/ErrorMessage';
import { Input } from '../components/Input';
import Todo from '../components/Todo';
import { ErrorContext } from '../errorContext';
import { useAddTodoMutation, useTodosQuery } from '../generated/gql';

export const Home: NextPage = () => {
    const { loading, error, data } = useTodosQuery();
    const [addTodo] = useAddTodoMutation({
        update(cache, { data }) {
            if (data) {
                cache.modify({
                    fields: {
                        todos(existingTodos = []) {
                            const newTodo = cache.writeFragment({
                                data: data.addTodo,
                                fragment: gql`
                                    fragment NewTodo on Todo {
                                        id
                                        text
                                        done
                                    }
                                `,
                            });
                            return [...existingTodos, newTodo];
                        },
                    },
                });
            }
        },
    });
    const [newTodoText, setNewTodoText] = useState('');
    const { setError } = useContext(ErrorContext);
    if (loading) return <div>Loading...</div>;
    if (error) return <ErrorMessage message="Error loading todos." />;
    return (
        <div className="container m-auto h-full">
            <h1 className="text-5xl text-center m-4 font-semibold">Your Todos</h1>
            <div className="p-5 m-5 shadow rounded bg-gray-300">
                <div className="container flex space-x-5 justify-between">
                    <Input
                        isFull
                        className="w-full rounded"
                        placeholder="Add a todo"
                        onChange={e => setNewTodoText(e.target.value)}
                        value={newTodoText}
                    />
                    <button
                        aria-label="Add todo"
                        className="bg-green-400 p-2 m-2 rounded !outline-none focus:ring focus:bg-green-200 transition duration-200"
                        onClick={async () => {
                            try {
                                await addTodo({
                                    variables: { text: newTodoText },
                                });
                            } catch (err) {
                                setError('Failed to add todo.');
                            }
                            setNewTodoText('');
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
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            {data ? (
                <>
                    <h2 className="text-3xl text-center m-4 font-semibold">Remaining</h2>
                    <div>
                        {data.todos.filter(todo => !todo.done).length > 0 ? (
                            data.todos
                                .filter(todo => !todo.done)
                                .map(todo => <Todo todo={todo} key={todo.id} />)
                        ) : (
                            <div className="my-10 text-3xl text-center text-gray-600">
                                No todos remaining! Yay!
                            </div>
                        )}
                    </div>
                    {data.todos.filter(todo => todo.done).length > 0 && (
                        <>
                            <h2 className="text-3xl text-center m-4 font-semibold">
                                Completed
                            </h2>
                            {data.todos
                                .filter(todo => todo.done)
                                .map(todo => (
                                    <Todo todo={todo} key={todo.id} />
                                ))}
                        </>
                    )}
                </>
            ) : (
                <ErrorMessage message="Unable to fetch todos." />
            )}
        </div>
    );
};

export default Home;
