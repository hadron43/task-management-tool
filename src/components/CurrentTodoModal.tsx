"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { setModalOpen } from "@/lib/features/todosSlice";

const CurrentTodoModal: React.FC = () => {
  const dispatch = useDispatch();
  const currentTodo = useSelector(
    (state: RootState) => state.todosSlice.current
  );
  const isModalOpen = useSelector(
    (state: RootState) => state.todosSlice.isModalOpen
  );

  if (!currentTodo || !isModalOpen) {
    return null;
  }

  const closeModal = () => {
    dispatch(setModalOpen(false));
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
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-600">
              <strong>ID:</strong>
            </p>
            <p className="col-span-2">{currentTodo.id}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-600">
              <strong>Text:</strong>
            </p>
            <p className="col-span-2">{currentTodo.text}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-600">
              <strong>Priority:</strong>
            </p>
            <p className="col-span-2">{currentTodo.priority}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-600">
              <strong>Status:</strong>
            </p>
            <p className="col-span-2">{currentTodo.status}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-600">
              <strong>Labels:</strong>
            </p>
            <p className="col-span-2">{currentTodo.labels.join(", ")}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-600">
              <strong>Due Date:</strong>
            </p>
            <p className="col-span-2">{currentTodo.dueDate}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-600">
              <strong>Created At:</strong>
            </p>
            <p className="col-span-2">{currentTodo.createdAt}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <p className="text-gray-600">
              <strong>Assignee:</strong>
            </p>
            <p className="col-span-2">{currentTodo.assignee}</p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
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
