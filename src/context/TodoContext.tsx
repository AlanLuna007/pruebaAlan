import { createContext } from "react";
import { Todo } from '../interfaces/interfaces';

export type TodoContextProps = {
    Todo: Todo,
    toggleTodo: ( username: string, password:string ) => void
}
export const TodoContext = createContext<TodoContextProps>({} as TodoContextProps);