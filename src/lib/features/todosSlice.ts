import { Todo, TodoLists, TodosState } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: TodosState = {
  open: [],
  inProgress: [],
  closed: [],
  current: null,
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (
      state,
      action: PayloadAction<{ list: keyof TodoLists; todo: Todo }>
    ) => {
      state[action.payload.list].push(action.payload.todo);
    },
    moveTodo: (
      state,
      action: PayloadAction<{
        from: keyof TodoLists;
        to: keyof TodoLists;
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
      action: PayloadAction<{ list: keyof TodoLists; id: string }>
    ) => {
      state[action.payload.list] = state[action.payload.list].filter(
        (todo) => todo.id !== action.payload.id
      );
    },
    next: (state, action: PayloadAction<{ list: keyof TodoLists }>) => {
      const todoIndex = state[action.payload.list].findIndex(
        (todo) => todo.id === state.current?.id
      );

      const nextIndex = todoIndex + 1;
      if (todoIndex !== -1 && nextIndex < state[action.payload.list].length) {
        state.current = state[action.payload.list][nextIndex];
      } else if (state[action.payload.list].length > 0) {
        state.current = state[action.payload.list][0];
      } else {
        state.current = null;
      }
    },
  },
});

export const { addTodo, moveTodo, removeTodo, next } = todosSlice.actions;
export default todosSlice.reducer;
