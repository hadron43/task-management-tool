export interface Todo {
  id: string;
  text: string;
}

export interface TodosState {
  open: Todo[];
  inProgress: Todo[];
  closed: Todo[];
}
