import { useState } from "react";
import useCoins from "@/customHooks/useCoins";
import useThemeContext from "@/context/theme/ThemeContext";
import SortField from "@/components/SortField";
import CoinRow from "@/components/CoinRow";
import CategorySelect from "@/components/CategorySelect";
import type { Coin } from "@/models/coin.model";
import type { Filters } from "@/models/filters.model";
import type { Pagination } from "@/models/pagination.model";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import PaginationBar from "@/components/PaginationBar";
import { useQueryClient } from "@tanstack/react-query";

const DEFAULT_NUM_OF_ROWS = 100;

const shimmer = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

const CoinSkeleton = styled.div`
  height: 50px;
  border-radius: 10px;
  background: linear-gradient(120deg, #787b7d 30%, #95989a 40%, #95989a 80%, #787b7d 90%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite linear;
`;

export default function Dashboard () {
  const [pagination, setPagination] = useState<Pagination>({ currentPage: 1, numOfRows: DEFAULT_NUM_OF_ROWS });
  const [filters, setFilters] = useState<Filters>({sortOption: "#_desc", category: ""});
  const {data, error, isLoading} = useCoins(filters, pagination);

  const {theme, toggleTheme} = useThemeContext();

  const queryClient = useQueryClient();

  if (error) return <div className="p-3">Error fetching coins!</div>;

  return (
    <>
      <div className="w-full text-xs p-6">
        <div className="flex justify-between">
          <div className="flex items-center">
            <label htmlFor="dark-mode">Dark mode</label>
            <input type="checkbox" id="dark-mode" name="dark-mode" checked={theme === "dark"} className="w-5 h-5 ml-2 cursor-pointer" onChange={() => toggleTheme()}/>
          </div>
          <div>
            <button
              className="p-3 rounded-xl font-semibold transition-colors dark:text-white cursor-pointer border border-gray-300 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700"
              onClick={() => queryClient.invalidateQueries({queryKey: ["coins"]})}
            >
              &#x21BB; Get latest data immediately!
            </button>
          </div>
          <div className="flex items-center">
            <span>Filter by category: </span>
            <CategorySelect setFilters={setFilters} setPagination={setPagination} category={filters.category}/>
          </div>
        </div>
        <table className="w-full">
          <caption className="p-4 font-bold text-lg">Crypto Dashboard</caption>
          <thead className="bg-white dark:bg-gray-900">
            <tr className="border-t border-b border-gray-200">
              <th className="text-right w-15">
                <SortField field="#" setFilters={setFilters} setPagination={setPagination} sortOption={filters.sortOption} name="#"/>
              </th>
              <th className="text-left">
                <SortField field="id" setFilters={setFilters} setPagination={setPagination} sortOption={filters.sortOption} name="coin"/>
              </th>
              <th className="text-right w-35">Price</th>
              <th className="text-right w-15">1h</th>
              <th className="text-right w-15">24h</th>
              <th className="text-right w-15">7d</th>
              <th className="text-right min-w-35">
                <SortField field="volume" setFilters={setFilters} setPagination={setPagination} sortOption={filters.sortOption} name="total volume"/>
              </th>
              <th className="text-right min-w-35">
                <SortField field="market_cap" setFilters={setFilters} setPagination={setPagination} sortOption={filters.sortOption} name="market cap"/>
              </th>
              <th className="text-right w-35">Last 7 Days</th>
            </tr>
          </thead>
          <tbody>
            {
              isLoading ?
                [...Array(5)].map((_, index) => {
                  return (
                    <tr key={index}><td colSpan={9}><CoinSkeleton/></td></tr>
                  );
                }) :
                !data.length ?
                  <tr className="border-t border-b border-gray-200 transition-colors">
                    <td colSpan={9} className="text-center">No coin left at this page</td>
                  </tr> :
                  (data as Coin[]).map((coin) => (
                    <CoinRow key={coin.id} coin={coin}/>
                  ))
            }
          </tbody>
        </table>

        {isLoading ? <></> : <PaginationBar pagination={pagination} setPagination={setPagination} dataLength={data.length}/>}

        <button
          className="fixed bottom-20 right-5 py-1 px-4 text-2xl rounded-xl bg-gray-700 text-gray-50 hover:bg-gray-600 cursor-pointer dark:bg-gray-500 dark:hover:bg-gray-400"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            })
          }}
        >
          &#10514;
        </button>
      </div>
    </>
  );
}
