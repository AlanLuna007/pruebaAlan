import { Todo } from '../interfaces/interfaces';

type TodoAction =
    | { type: 'addTodo', payload: Todo }
    | { type: 'toggleTodo', payload: { username: string, password: string }};

export const todoReducer = ( state: Todo, action: TodoAction ): Todo => {
    console.log('action', action);
    // console.log('state', state);
    
    switch (action.type) {
        case 'addTodo':
            return {
                ...state,
                // Todo: [ ...state, action.payload ]
            }
        case 'toggleTodo':
            if ( state.username !== action.payload.username ) {
                console.log('state.username', state.username);
                console.log('action.payload.username', action.payload.username);
                
                state.username = action.payload.username;
                state.password = action.payload.password;
            }
            return {
                ...state,
                // if ( Todo.id === action.payload.id ) {
                
                // }
                }
                // [ ...state, action.payload ]
            
    
        default:
            return state;
    }
}