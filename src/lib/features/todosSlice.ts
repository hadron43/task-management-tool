import { Todo, TodoLists, TodosState } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getRandomTasks } from "@/lib/utils";

const initialState: TodosState = {
  open: [],
  inProgress: [],
  closed: [],

  listStatus: {
    open: { loaded: false, hasMore: true },
    inProgress: { loaded: false, hasMore: true },
    closed: { loaded: false, hasMore: true },
  },

  current: null,
  search: "",
  sort: null,

  isModalOpen: false,
  isSidebarOpen: false,
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
        comment: string;
      }>
    ) => {
      const todoIndex = state[action.payload.from].findIndex(
        (todo) => todo.id === action.payload.id
      );
      if (todoIndex !== -1) {
        const [todo] = state[action.payload.from].splice(todoIndex, 1);
        state[action.payload.to].push({
          ...todo,
          comment: action.payload.comment,
          status: action.payload.to.toUpperCase(),
        });
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
    setCurrent: (state, action: PayloadAction<Todo | null>) => {
      state.current = action.payload;
    },
    previous: (state, action: PayloadAction<{ list: keyof TodoLists }>) => {
      const todoIndex = state[action.payload.list].findIndex(
        (todo) => todo.id === state.current?.id
      );

      const prevIndex = todoIndex - 1;
      if (
        todoIndex !== -1 &&
        prevIndex >= 0 &&
        prevIndex < state[action.payload.list].length
      ) {
        state.current = state[action.payload.list][prevIndex];
      } else if (state[action.payload.list].length > 0) {
        state.current =
          state[action.payload.list][state[action.payload.list].length - 1];
      } else {
        state.current = null;
      }
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
    loadMore: (state, action: PayloadAction<keyof TodoLists>) => {
      if (state.listStatus[action.payload].hasMore) {
        state.listStatus[action.payload].loaded = false;

        const newTasks = getRandomTasks(50, action.payload.toUpperCase());

        state[action.payload] = [...state[action.payload], ...newTasks];
        if (state[action.payload].length >= 500) {
          state.listStatus[action.payload].hasMore = false;
        }
        state.listStatus[action.payload].loaded = true;
      }
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setSort: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sort = action.payload;
    },
    clearSearch: (state) => {
      state.search = initialState.search;
    },
    clearSort: (state) => {
      state.sort = initialState.sort;
    },
    setModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const {
  addTodo,
  moveTodo,
  removeTodo,
  setCurrent,
  previous,
  next,
  setSearch,
  setSort,
  clearSearch,
  clearSort,
  loadMore,
  setModalOpen,
  setSidebarOpen,
} = todosSlice.actions;
export default todosSlice.reducer;
