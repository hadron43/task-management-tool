"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { Todo, TodoLists } from "@/types";
import { useEffect, useState } from "react";
import { next } from "@/lib/features/todosSlice";

interface TableViewProps {
  type: keyof TodoLists;
}

const TableView: React.FC<TableViewProps> = ({ type }) => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todosSlice[type]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc" | null>(null);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>(todos);

  useEffect(() => {
    let filtered = todos.filter((todo) =>
      todo.text.toLowerCase().includes(search.toLowerCase())
    );
    if (sort) {
      filtered = filtered.sort((a, b) =>
        sort === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    setFilteredTodos(filtered);
  }, [todos, search, sort]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableElement>) => {
    // Implement keyboard navigation and task opening logic here
    console.log("Key pressed:", event.key);
    dispatch(next({ list: type }));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">{type} Todos</h2>
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2"
        />
        <button onClick={() => setSort(sort === "asc" ? "desc" : "asc")}>
          Sort by Created At ({sort || "none"})
        </button>
        <button
          onClick={() => {
            setSearch("");
            setSort(null);
          }}
        >
          Clear
        </button>
      </div>
      <table onKeyDown={handleKeyDown} className="w-full">
        <thead>
          <tr>
            <th>Priority</th>
            <th>ID</th>
            <th>Status</th>
            <th>Labels</th>
            <th>Name</th>
            <th>Due Date</th>
            <th>Created At</th>
            <th>Assignee</th>
          </tr>
        </thead>
        <tbody>
          {filteredTodos.map((todo: Todo) => (
            <tr key={todo.id} className="border-b">
              <td>{todo.priority}</td>
              <td>{todo.id}</td>
              <td>{todo.status}</td>
              <td>{todo.labels.join(", ")}</td>
              <td>{todo.text}</td>
              <td>{todo.dueDate}</td>
              <td>{todo.createdAt}</td>
              <td>{todo.assignee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
