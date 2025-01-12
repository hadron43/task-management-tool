"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { Todo, TodoLists } from "@/types";
import {
  loadMore,
  setCurrent,
  setModalOpen,
  next,
  previous,
} from "@/lib/features/todosSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef } from "react";

interface TableViewProps {
  readonly type: keyof TodoLists;
}

const TableView: React.FC<TableViewProps> = ({ type }) => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todosSlice[type]);
  const hasMore = useSelector(
    (state: RootState) => state.todosSlice.listStatus[type].hasMore
  );
  const search = useSelector((state: RootState) => state.todosSlice.search);
  const sort = useSelector((state: RootState) => state.todosSlice.sort);
  const current = useSelector((state: RootState) => state.todosSlice.current);

  const filteredTodos = todos
    .filter((todo: Todo) =>
      todo.text.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a: Todo, b: Todo) => {
      if (sort === "asc") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sort === "desc") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      return 0;
    });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const spinnerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(loadMore(type));
        }
      },
      { threshold: 1.0 }
    );
    observerRef.current = observer;

    if (spinnerRef.current) {
      observer.observe(spinnerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [dispatch, hasMore, type, todos]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      console.log(`Key pressed: ${event.key}`);
      if (event.key == "Enter" && current) {
        dispatch(setModalOpen(true));
      } else if (event.key == "Escape") {
        dispatch(setModalOpen(false));
      } else if (event.key == "ArrowDown") {
        event.preventDefault();
        dispatch(next({ list: type }));
      } else if (event.key == "ArrowUp") {
        event.preventDefault();
        dispatch(previous({ list: type }));
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [dispatch, current, type]);

  useEffect(() => {
    if (current) {
      const currentElement = document.getElementById(`todo-${current.id}`);
      if (currentElement) {
        const rect = currentElement.getBoundingClientRect();
        const isVisible =
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <=
            (window.innerWidth || document.documentElement.clientWidth);

        if (!isVisible) {
          window.scrollTo({ top: 0, behavior: "auto" }); // Cancel any ongoing smooth scroll
          currentElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    }
  }, [current]);

  return (
    <div className="p-4">
      <table className="w-full bg-white shadow-sm tracking-wider">
        <thead className="sticky top-0 ">
          <tr className="bg-gray-200 text-left text-sm font-medium text-gray-500 uppercase">
            <th className="px-6 py-3">Priority</th>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Labels</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Due Date</th>
            <th className="px-6 py-3">Created At</th>
            <th className="px-6 py-3">Assignee</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredTodos.map((todo: Todo) => (
            <tr
              key={todo.id}
              id={`todo-${todo.id}`}
              className={`transition-colors duration-200 text-sm text-gray-500 ${
                todo.id === current?.id ? "bg-gray-100" : ""
              }`}
              onMouseEnter={() => dispatch(setCurrent(todo))}
              onClick={() => dispatch(setModalOpen(true))}
            >
              <td className="px-6 py-4">{todo.priority}</td>
              <td className="px-6 py-4">{todo.id}</td>
              <td className="px-6 py-4">{todo.status}</td>
              <td className="px-6 py-4">{todo.labels.join(", ")}</td>
              <td className="px-6 py-4 text-gray-900">{todo.text}</td>
              <td className="px-6 py-4">{todo.dueDate}</td>
              <td className="px-6 py-4">{todo.createdAt}</td>
              <td className="px-6 py-4">{todo.assignee}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {hasMore && (
        <div className="h-10 flex items-center justify-center" ref={spinnerRef}>
          <FontAwesomeIcon icon={faSpinner} spin size="2x" className="w-10" />
        </div>
      )}
    </div>
  );
};

export default TableView;
