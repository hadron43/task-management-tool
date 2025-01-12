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

export interface ListStatus {
  loaded: boolean;
  hasMore: boolean;
}

export interface TodosState extends TodoLists {
  listStatus: { [key in keyof TodoLists]: ListStatus };
  current: Todo | null;
  search: string;
  sort: "asc" | "desc" | null;
  isModalOpen: boolean;
}

export interface TodoLists {
  open: Todo[];
  inProgress: Todo[];
  closed: Todo[];
}