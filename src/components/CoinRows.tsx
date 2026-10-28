// import React, { useRef } from "react";
// import CoinRow from "@/CoinRow";
// import type { Coin } from "@/models/coin.model";
// import { useVirtualizer } from "@/tanstack/react-virtual";

// interface CoinRowsProps {
//   coins: Coin[],
//   isLoading: boolean
// }

// function CoinRows ({coins, isLoading}: CoinRowsProps) {
//   const parentRef = useRef(null);
//   const rowVirtualizerSettings = useVirtualizer({
//     count: coins.length,
//     getScrollElement: () => parentRef.current,
//     estimateSize: () => 85, // in pixel
//     overscan: 5
//   });

//   return (
//     <div
//       ref={parentRef}
//       className="overflow-y-auto"
//       style={{height: "600px"}}
//     >
//       <div 
//         className="relative"
//         style={{ height: `${rowVirtualizerSettings.getTotalSize()}px` }}
//       >
//         {rowVirtualizerSettings.getVirtualItems().map((virtualRow) => {
//           // const rank = (pagination.currentPage - 1) * pagination.numOfRows + index +  1;
//           const coin = coins[virtualRow.index];

//           return (
//             <table 
//               key={coin.market_cap_rank}
//               className="absolute top-0 left-0 w-full table-fixed"              
//               style={{
//                 height: `${virtualRow.size}px`,
//                 transform: `translateY(${virtualRow.start}px)`, // Dùng GPU transform để định vị vị trí
//               }}
//             >
//               <tbody>                
//                 <CoinRow coin={coin} isLoading={isLoading}/>
//               </tbody>
//             </table>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default React.memo(CoinRows);