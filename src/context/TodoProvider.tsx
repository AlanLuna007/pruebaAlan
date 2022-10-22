import { useReducer } from "react";
import { TodoContext } from './TodoContext';
import { Todo } from '../interfaces/interfaces';
import { todoReducer } from './todoReducer';

const INITIAL_STATE: Todo = {
    username: '', 
    password: ''
}

interface props {
    children: JSX.Element | JSX.Element[]
}

export const TodoProvider = ({ children }: props ) => {

const [Todo, dispatch] = useReducer(todoReducer, INITIAL_STATE);

const toggleTodo = ( username: string, password: string ) => {
    dispatch({ type: 'toggleTodo', payload: { username, password }})
}

  return (
    <TodoContext.Provider value={{
        Todo,
        toggleTodo
    }}>
        { children }
    </TodoContext.Provider>
  )
}
