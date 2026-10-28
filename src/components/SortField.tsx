import type { Dispatch, SetStateAction } from "react";
import React, { useState } from "react";
import type { Filters } from "@/models/filters.model";
import type { Pagination } from "@/models/pagination.model";

interface SortFieldProps {
  field: string,
  setFilters: Dispatch<SetStateAction<Filters>>,
  setPagination: Dispatch<SetStateAction<Pagination>>,
  sortOption: string,
  name: string,
}

function SortField ({field, setFilters, setPagination, sortOption, name}: SortFieldProps) {

  const [isHoverd, setIsHovered] = useState(false);

  function handleSortFieldClicked() {
    setFilters(prev => (
      prev.sortOption.includes(field) ?
        {...prev, sortOption: `${field}_${prev.sortOption.includes("asc") ? "desc" : "asc"}`} :
        {...prev, sortOption: `${field}_asc`}));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }

  return (
    <>
      <button
        className={`text-xs my-2 cursor-pointer flex items-center w-full ${name === "coin" ? "" : "justify-end"}`}
        onClick={handleSortFieldClicked}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >

        {
          name !== "coin" ?
            <>
              <span className={`${sortOption.includes(field) || isHoverd ? "mx-1 opacity-100" : "mx-1 opacity-0"}`}>
                { sortOption.includes(`${field}_desc`) ? <span>&#9660;</span> : <span>&#9650;</span> }
              </span>
              <span className="capitalize">{name}</span>
            </> :
            <>
              <span className="capitalize">{name}</span>
              <span className={`${sortOption.includes(field) || isHoverd ? "mx-1 opacity-100" : "mx-1 opacity-0"}`}>
                { sortOption.includes(`${field}_desc`) ? <span>&#9660;</span> : <span>&#9650;</span> }
              </span>
            </>
        }
      </button>
    </>
  );
}

export default React.memo(SortField);
