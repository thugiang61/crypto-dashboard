import React, { type Dispatch, type SetStateAction } from "react";
import type { Pagination } from "@/models/pagination.model";
import PaginationButton from "@/components/PaginationButton";
// import useAllCoins from "@/customHooks/useAllCoins";

interface PaginationBarProps {
  pagination: Pagination,
  setPagination: Dispatch<SetStateAction<Pagination>>,
  dataLength: number
}

function PaginationBar ({pagination, setPagination, dataLength} : PaginationBarProps) {
  // const { data, error, isLoading } = useAllCoins();

  // const totalCoins = isLoading ? 0 : data.length;
  // const totalPages = totalCoins > pagination.numOfRows ? Math.ceil(totalCoins / pagination.numOfRows) : 1;

  // useMemo: Chỉ tính lại khi currentPage hoặc totalPages thay đổi
  // const paginationNumbers = useMemo(() => {
  //   const delta = (pagination.currentPage === 1 || pagination.currentPage === totalPages) ? 4 : 2;
  //   const range = [];
  //   const rangeWithDots: (number | string)[] = [];
  //   let l: number | undefined;

  //   for (let i = 1; i <= totalPages; i++) {
  //     if (
  //       i === 1 ||
  //       i === totalPages ||
  //       (i >= pagination.currentPage - delta && i <= pagination.currentPage + delta)
  //     ) {
  //       range.push(i);
  //     }
  //   }

  //   for (const i of range) {
  //     if (l) {
  //       if (i - l === 2) {
  //         rangeWithDots.push(l + 1);
  //       } else if (i - l !== 1) {
  //         rangeWithDots.push('...');
  //       }
  //     }
  //     rangeWithDots.push(i);
  //     l = i;
  //   }

  //   return rangeWithDots;
  // }, [pagination.currentPage, totalPages]);

  const from = dataLength ? (pagination.currentPage - 1) * pagination.numOfRows + 1 : 0;
  const to = dataLength ? from + dataLength - 1 : 0;
  
  // if (error) return <div className="my-3">Error fetching all coins in pagination bar</div>;
  // if (isLoading) return <></>;

  return (
    <>
      <div className="m-4 flex justify-between items-center">
        {/* <div className="text-sm">Showing {from} to {to} of {totalCoins} results</div> */}
        <div className="text-sm">Showing {from} to {to}</div>
        <div>
          {/* click vào PaginationButton -> PaginationButton gọi setPagination 
          -> currentPage thay đổi -> gọi lại api và lấy data ms để hiện lên table và paginationNUmbers cx thay đổi */}
          <PaginationButton 
            isDisabled={pagination.currentPage === 1} 
            isActive={false} 
            value="&#9668;" 
            setPagination={setPagination}
            // totalPages={totalPages}
          />
          {/* {paginationNumbers.map((number, index) => {
            return (
              // <>
                typeof number === "number" ? 
                  <PaginationButton 
                    key={index} 
                    isActive={pagination.currentPage === number} 
                    isDisabled={false} 
                    value={number} 
                    setPagination={setPagination}
                    totalPages={totalPages}
                  /> : "..."
              // </>
            );
          })} */}
          <PaginationButton 
            // isDisabled={pagination.currentPage === totalPages} 
            isDisabled={dataLength === 0} 
            isActive={false} 
            value="&#9658;" 
            setPagination={setPagination}
            // totalPages={totalPages}
          />
          {/* current: {pagination.currentPage} */}
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
            <option value="250">250</option> {/*max của free-tier*/}
          </select>
        </div>
      </div>
    </>
  );
}

export default React.memo(PaginationBar);