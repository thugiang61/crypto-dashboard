import type { Dispatch, SetStateAction } from "react";
import type { Pagination } from "@/models/pagination.model";
import React from "react";

interface PaginationButtonProps {
  value: "&#9668;" | "◄" | "►" | "&#9658;" | number,
  setPagination: Dispatch<SetStateAction<Pagination>>;
  isDisabled: boolean,
  isActive: boolean,
}

function PaginationButton ({ value, setPagination, isDisabled, isActive }: PaginationButtonProps) {

  return (
    <>
      <button
        disabled={isDisabled}
        className={
          `px-4 py-2 m-1 rounded-xl font-semibold transition-colors
          disabled:text-gray-400 disabled:border-gray-200 disabled:dark:border-gray-700 disabled:cursor-default border border-gray-400 dark:border-white
          ${isActive ? "text-green-400 bg-green-100 hover:bg-green-100" : " dark:text-white cursor-pointer enabled:hover:bg-gray-200 enabled:dark:hover:bg-gray-700"}`
        }
        onClick={() => setPagination((prev =>
          (
            {
              ...prev,
              currentPage: (value === "&#9668;" || value === "◄") ?
                Math.max(1, prev.currentPage - 1) : (value === "&#9658;" || value === "►") ?
                prev.currentPage + 1 : value
            }
          )))}
      >
        {value}
      </button>
    </>
  );
}

export default React.memo(PaginationButton);
