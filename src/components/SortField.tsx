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
  // console.log("display when click on PaginationButton and update Dashbord's pagination state (before use react.memo for SortField)")

  const [isHoverd, setIsHovered] = useState(false);
  
  function handleSortFieldClicked() {
    setFilters(prev => (
      prev.sortOption.includes(field) ? 
        {...prev, sortOption: `${field}_${prev.sortOption.includes("asc") ? "desc" : "asc"}`} :
        {...prev, sortOption: `${field}_asc`}));
    // console.log(field, sortOption)
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
        {/* <span className={`${name !== "coin" ? "capitalize" : "invisible"}`}>{name}</span>
        <span className={`${sortOption.includes(field) ? "mx-1" : "opacity-0 hover:opacity-100"}`}>
          { sortOption.includes(`${field}_desc`) ? <span>&#9660;</span> : <span>&#9650;</span> }  */}
          {/*hiện mũi tên lên lúc sortOption ko phải là field hoặc ko phải chìu xuốg*/}
        {/* </span>
        <span className={`${name === "coin" ? "capitalize" : "invisible"}`}>{name}</span> */}
        {/* 2 dkien ở trên vẫn chưa triệt tiêu nhau nên là phải làm logic phía dưới */}

        {
          name !== "coin" ? 
            <>
              <span className={`${sortOption.includes(field) || isHoverd ? "mx-1 opacity-100" : "mx-1 opacity-0"}`}>
                { sortOption.includes(`${field}_desc`) ? <span>&#9660;</span> : <span>&#9650;</span> } {/*hiện mũi tên lên lúc sortOption ko phải là field hoặc ko phải chìu xuốg*/}
              </span>
              <span className="capitalize">{name}</span>
            </> :
            <>
              <span className="capitalize">{name}</span>
              <span className={`${sortOption.includes(field) || isHoverd ? "mx-1 opacity-100" : "mx-1 opacity-0"}`}>
                { sortOption.includes(`${field}_desc`) ? <span>&#9660;</span> : <span>&#9650;</span> } {/*hiện mũi tên lên lúc sortOption ko phải là field hoặc ko phải chìu xuốg*/}
              </span>
            </>
        }
      </button>
    </>
  );
}

export default React.memo(SortField);