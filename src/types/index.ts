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

export interface TodosState extends TodoLists {
  current: Todo | null;
}

export interface TodoLists {
  open: Todo[];
  inProgress: Todo[];
  closed: Todo[];
}