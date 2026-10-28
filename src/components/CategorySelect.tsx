import type { Dispatch, SetStateAction } from "react";
import useCategories from "@/customHooks/useCategories";
import type { Category } from "@/models/coin.model";
import type { Filters } from "@/models/filters.model";
import React from "react";
import type { Pagination } from "@/models/pagination.model";

interface CategorySelectProps {
  setFilters: Dispatch<SetStateAction<Filters>>,
  setPagination: Dispatch<SetStateAction<Pagination>>,
  category: string
}


function CategorySelect ({category, setFilters, setPagination}: CategorySelectProps) {
  const {data, error, isLoading} = useCategories();

  if (error) return <div className="m-2">Error fetching categories!</div>;


  return (
    <>
      {
        isLoading ?
          <div className="w-70 h-7 bg-gray-500 rounded ml-2"></div> :
          <select
            name="category"
            id="category"
            className="cursor-pointer rounded bg-gray-200 border-gray-200 m-2 p-1 dark:text-white dark:bg-gray-600"
            value={category}
            onChange={(e) => {
              setFilters({category: e.target.value, sortOption: "#_desc"});
              setPagination(prev => ({...prev, currentPage: 1}))
            }}
          >
                <option key="all" value={""}>All</option>
                {(data as Category[]).map((category) => {
                  return (
                    <option key={category.category_id} value={category.category_id}>
                      {category.name}
                    </option>
                  );
                })}
          </select>
      }
    </>
  );
}

export default React.memo(CategorySelect);
