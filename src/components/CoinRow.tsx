import React from "react";
import type { Coin } from "@/models/coin.model";
import Sparkline from "@/components/Sparkline";
import usePortfolioContext from "@/context/portfolio/PortfolioContext";
// import styled from "@/emotion/styled";
// import { keyframes } from "@/emotion/react";

interface CoinRowProps {
  coin: Coin,
  // isLoading: boolean,
  style?: React.CSSProperties, // ← Thêm để virtual scroll truyền vị trí vào
}

// const shimmer = keyframes`
//   0% {
//     background-position: 200% 0;
//   }
//   100% {
//     background-position: -200% 0;
//   }
// `;

// const CoinSkeleton = styled.div`
//   height: 50px;
//   border-radius: 10px;
//   background: linear-gradient(120deg, #787b7d 30%, #95989a 40%, #95989a 80%, #787b7d 90%);
//   background-size: 200% 100%;
//   animation: ${shimmer} 1.5s infinite linear;
// `;

// function CoinRow ({coin, isLoading}: CoinRowProps) {
function CoinRow ({coin, style}: CoinRowProps) {
  // console.log("display when click on dark mode button and update Dashbord's theme (before use react.memo for CoinArrow)")

  const {savedCoins, toggleSavedCoin} = usePortfolioContext();

  function handlePercentage(percent: number) {
    // return (
    //   <span >
    //     {Math.abs(Number(percent))}
    //   </span>
    // );

    // nếu percent lớn hơn -0.1 (để nhữg số kiểu như -0.000009 sau khi replace thành 0.0 thì vẫn hiện màu xanh) thì replace dấu "-" và replace típ theo regex để lấy 1 số sau dấu thập phân và hiện màu xanh + mũi tên lên
    // nếu percent nhở hơn hoặc bằng -0.1 thì replace dấu "-" và replace típ theo regex để lấy 1 số sau dấu thập phân và hiện màu đỏ + mũi tên xuống
    // const displayedPercent = percent.toString().replace("-", "").replace(/(\d+\.\d)\d+/g, '$1');
    // if (percent >= -0.1) return (

    const truncated = Math.trunc(percent * 10) / 10;  // 19.00007 -> 19, -0.0008 -> -0 và -0 lớn hơn hoặc bằg 0
    const displayedPercent = Math.abs(truncated).toFixed(1); // đảm bảo luôn có 1 số thập phân kể cả truncated có là số nguyên
    if (truncated >= 0) return (
      <span className="text-green-500 flex items-center justify-end">
        <span className="text-xs mx-1">&#9650;</span> {displayedPercent}% {/* vẫn phải dùng Math.abs vs số dươg để cover luôn trường hợp fixedercent là -0.0 */}
      </span>
    );
    else return (
      <span className="text-red-500 flex items-center justify-end">
        <span className="text-xs mx-1">&#9660;</span> {displayedPercent}%
      </span>
    );
  }

  // if (isLoading) return <tr><td colSpan={9}><CoinSkeleton/></td></tr>;

  return (
    <>
      {/* <tr className="border-t border-b border-gray-200 hover:bg-gray-100 transition-colors dark:hover:bg-gray-700"> */}
      <tr className="border-t border-b border-gray-200 hover:bg-gray-100 transition-colors dark:hover:bg-gray-700" style={style}>
        {/* <td>
          <span className="text-2xl mx-4 text-gray-500">&#9734;</span>
        </td> */}
        <td className="text-right">
          {/* <div className="flex items-center gap-2"> */}
            {/* <span className="text-2xl mx-4 text-gray-500 cursor-pointer">&#9734;</span>
            {rank} */}
            
          <div className={`flex gap-2 items-center ${savedCoins[coin.id] ? "text-yellow-300": ""}`}>
            <svg className={`w-6 h-6 ${savedCoins[coin.id] ? "fill-current" : "fill-none"} cursor-pointer`}
              stroke='currentColor'
              viewBox='0 0 24 24'
              onClick={() => toggleSavedCoin(coin.id)}
            >
              <path strokeWidth="1.5" d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
            </svg>
            {/* {rank} */}<span className="text-black dark:text-gray-400">{coin.market_cap_rank}</span>
              {/* <div className="text-black">{rank}</div> */}
          </div>
          {/* </div> */}
        </td>
        <td id="coin-name" className="text-left mt-1 flex items-center gap-2">
          <img src={coin.image} alt={coin.name} className="w-8 h-8"/>
          <span className="text-wrap">{coin.name}</span>
          <span className="text-gray-500 uppercase text-wrap">{coin.symbol}</span>
        </td>
        <td className="text-right">${coin.current_price.toLocaleString()}</td>
        <td className="text-right">{handlePercentage(coin.price_change_percentage_1h_in_currency)}</td>
        <td className="text-right">{handlePercentage(coin.price_change_percentage_24h)}</td>
        <td className="text-right">{handlePercentage(coin.price_change_percentage_7d_in_currency)}</td>
        <td className="text-right">${coin.total_volume.toLocaleString()}</td>
        <td className="text-right">${coin.market_cap.toLocaleString()}</td>
        <td className=""><Sparkline data={coin.sparkline_in_7d.price}/></td>
      </tr>
    </>
  );
}

export default React.memo(CoinRow);