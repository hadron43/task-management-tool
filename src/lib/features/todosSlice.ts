import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Todo {
  id: string;
  text: string;
}

interface TodosState {
  open: Todo[];
  inProgress: Todo[];
  closed: Todo[];
}

const initialState: TodosState = {
  open: [],
  inProgress: [],
  closed: [],
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (
      state,
      action: PayloadAction<{ list: keyof TodosState; todo: Todo }>
    ) => {
      state[action.payload.list].push(action.payload.todo);
    },
    moveTodo: (
      state,
      action: PayloadAction<{
        from: keyof TodosState;
        to: keyof TodosState;
        id: string;
      }>
    ) => {
      const todoIndex = state[action.payload.from].findIndex(
        (todo) => todo.id === action.payload.id
      );
      if (todoIndex !== -1) {
        const [todo] = state[action.payload.from].splice(todoIndex, 1);
        state[action.payload.to].push(todo);
      }
    },
    removeTodo: (
      state,
      action: PayloadAction<{ list: keyof TodosState; id: string }>
    ) => {
      state[action.payload.list] = state[action.payload.list].filter(
        (todo) => todo.id !== action.payload.id
      );
    },
  },
});

export const { addTodo, moveTodo, removeTodo } = todosSlice.actions;
export default todosSlice.reducer;
