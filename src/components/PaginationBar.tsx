import React, { type Dispatch, type SetStateAction } from "react";
import type { Pagination } from "@/models/pagination.model";
import PaginationButton from "@/components/PaginationButton";

interface PaginationBarProps {
  pagination: Pagination,
  setPagination: Dispatch<SetStateAction<Pagination>>,
  dataLength: number
}

function PaginationBar ({pagination, setPagination, dataLength} : PaginationBarProps) {






  const from = dataLength ? (pagination.currentPage - 1) * pagination.numOfRows + 1 : 0;
  const to = dataLength ? from + dataLength - 1 : 0;


  return (
    <>
      <div className="m-4 flex justify-between items-center">
        <div className="text-sm">Showing {from} to {to}</div>
        <div>
          <PaginationButton
            isDisabled={pagination.currentPage === 1}
            isActive={false}
            value="&#9668;"
            setPagination={setPagination}
          />
          <PaginationButton
            isDisabled={dataLength === 0}
            isActive={false}
            value="&#9658;"
            setPagination={setPagination}
          />
        </div>
        <div>
          <span className="text-sm">Rows</span>
          <select
            name="rows" id="rows" value={pagination.numOfRows}
            className="cursor-pointer rounded bg-gray-200 border-gray-200 m-2 p-1 dark:text-white dark:bg-gray-600"
            onChange={(e) => setPagination({currentPage: 1, numOfRows: Number(e.target.value)})}
          >
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="250">250</option>
          </select>
        </div>
      </div>
    </>
  );
}

export default React.memo(PaginationBar);
