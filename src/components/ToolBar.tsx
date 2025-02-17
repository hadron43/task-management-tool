"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  setSearch,
  setSort,
  clearSearch,
  clearSort,
  setSidebarOpen,
} from "@/lib/features/todosSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

const ToolBar: React.FC = () => {
  const dispatch = useDispatch();
  const search = useSelector((state: RootState) => state.todosSlice.search);
  const sort = useSelector((state: RootState) => state.todosSlice.sort);

  const showSideBar = () => {
    dispatch(setSidebarOpen(true));
  };

  useEffect(() => {
    const savedSearch = sessionStorage.getItem("todoSearch");
    const savedSort = sessionStorage.getItem("todoSort");

    if (savedSearch) {
      dispatch(setSearch(savedSearch));
    }

    if (savedSort) {
      if (savedSort === "asc" || savedSort === "desc") {
        dispatch(setSort(savedSort));
      }
    }
  }, [dispatch]);

  useEffect(() => {
    sessionStorage.setItem("todoSearch", search);
  }, [search]);

  useEffect(() => {
    sessionStorage.setItem("todoSort", sort || "");
  }, [sort]);

  return (
    <div className="container p-2 sm:p-4 z-10 flex flex-col items-center justify-between p-3 bg-gradient-to-r from-white to-gray-300 text-white shadow-lg space-y-3 md:space-y-0 rounded-lg">
      <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-2">
        <div className="flex flex-row items-center space-x-2">
          <button
            className={`p-2 bg-gray-800 text-white rounded-md sm:hidden`}
            onClick={showSideBar}
          >
            <FontAwesomeIcon
              icon={faAngleRight}
              className="h-6 w-6 flex m-auto"
            />
          </button>

          <input
            type="text"
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            placeholder="Search..."
            className="search-bar p-2 border border-gray-300 rounded text-black"
          />

          <button
            onClick={() => dispatch(clearSearch())}
            className="clear-button p-2 border border-gray-300 rounded bg-white text-black hover:bg-gray-50 whitespace-nowrap"
          >
            Clear Search
          </button>
        </div>
        <div className="flex flex-row items-center space-x-2">
          <select
            value={sort ? sort : ""}
            onChange={(e) => {
              if (e.target.value === "") {
                dispatch(clearSort());
              } else {
                dispatch(setSort(e.target.value === "asc" ? "asc" : "desc"));
              }
            }}
            className="sort-select p-2 border border-gray-300 rounded text-black w-40"
          >
            <option value="">Sort by</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <button
            onClick={() => dispatch(clearSort())}
            className="clear-button p-2 border border-gray-300 rounded bg-white text-black hover:bg-gray-50 whitespace-nowrap"
          >
            Clear Sort
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolBar;
