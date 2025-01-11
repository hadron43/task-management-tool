export interface Todo {
  id: string;
  text: string;
  priority: string;
  status: string;
  labels: string[];
  dueDate: string;
  createdAt: string;
  assignee: string;
}

export interface TodosState {
  open: Todo[];
  inProgress: Todo[];
  closed: Todo[];
}
