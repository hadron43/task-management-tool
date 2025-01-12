"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { setModalOpen, moveTodo } from "@/lib/features/todosSlice";
import { TodoLists } from "@/types";

const StatusMap: { [key: string]: string } = {
  OPEN: "open",
  INPROGRESS: "inProgress",
  CLOSED: "closed",
};

const ModalContent: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div className="grid grid-cols-3 gap-2">
    <p className="text-gray-600">
      <strong>{label}:</strong>
    </p>
    <p className="col-span-2">{value}</p>
  </div>
);

const CurrentTodoModal: React.FC = () => {
  const dispatch = useDispatch();
  const currentTodo = useSelector(
    (state: RootState) => state.todosSlice.current
  );
  const isModalOpen = useSelector(
    (state: RootState) => state.todosSlice.isModalOpen
  );
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const [status, setStatus] = useState(currentTodo?.status || "open");
  const [comment, setComment] = useState("");
  const isEditing = React.useMemo(
    () => status !== currentTodo?.status,
    [status, currentTodo?.status]
  );

  useEffect(() => {
    setStatus(currentTodo?.status || "");
    setComment("");
  }, [currentTodo]);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, [isEditing]);

  useEffect(() => {
    setTimeout(() => setComment(""), 5);
  }, [status]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "1") {
        setStatus(StatusMap.OPEN.toUpperCase());
      } else if (event.key === "2") {
        setStatus(StatusMap.INPROGRESS.toUpperCase());
      } else if (event.key === "3") {
        setStatus(StatusMap.CLOSED.toUpperCase());
      } else if (event.key === "Enter" && isEditing && comment && currentTodo) {
        dispatch(
          moveTodo({
            id: currentTodo?.id,
            from: StatusMap[
              currentTodo?.status as keyof typeof StatusMap
            ] as keyof TodoLists,
            to: StatusMap[status] as keyof TodoLists,
            comment: comment,
          })
        );
        dispatch(setModalOpen(false));
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [isEditing, comment, currentTodo, dispatch, status]);

  if (!currentTodo || !isModalOpen) {
    return null;
  }

  const closeModal = () => {
    dispatch(setModalOpen(false));
  };

  const handleSave = () => {
    dispatch(
      moveTodo({
        id: currentTodo.id,
        from: StatusMap[
          currentTodo.status as keyof typeof StatusMap
        ] as keyof TodoLists,
        to: StatusMap[status] as keyof TodoLists,
        comment: comment,
      })
    );
    closeModal();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Todo</h2>
        </div>

        <div className="px-6 py-4 space-y-3">
          <ModalContent label="ID" value={currentTodo.id} />
          <ModalContent label="Text" value={currentTodo.text} />
          <ModalContent label="Priority" value={currentTodo.priority} />
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-600">
              <strong>Status:</strong>
            </p>
            <div className="col-span-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border rounded-md p-2 w-full"
              >
                <option value={StatusMap.OPEN.toUpperCase()}>Open</option>
                <option value={StatusMap.INPROGRESS.toUpperCase()}>
                  In Progress
                </option>
                <option value={StatusMap.CLOSED.toUpperCase()}>Closed</option>
              </select>
            </div>
          </div>
          <ModalContent label="Labels" value={currentTodo.labels.join(", ")} />
          <ModalContent label="Due Date" value={currentTodo.dueDate} />
          <ModalContent label="Created At" value={currentTodo.createdAt} />
          <ModalContent label="Assignee" value={currentTodo.assignee} />
          {currentTodo.comment && (
            <ModalContent label="Comment" value={currentTodo.comment} />
          )}
          {isEditing && (
            <div className="grid grid-cols-3 gap-2">
              <p className="text-gray-600">
                <strong>Comment:</strong>
              </p>
              <textarea
                ref={textAreaRef}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="col-span-2 border rounded-md p-2 w-full"
              />
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-2">
          {isEditing && (
            <button
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors duration-200"
              onClick={handleSave}
              disabled={!comment}
            >
              Save
            </button>
          )}
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrentTodoModal;
