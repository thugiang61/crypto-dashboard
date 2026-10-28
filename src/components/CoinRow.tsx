import React from "react";
import type { Coin } from "@/models/coin.model";
import Sparkline from "@/components/Sparkline";
import usePortfolioContext from "@/context/portfolio/PortfolioContext";

interface CoinRowProps {
  coin: Coin,
  style?: React.CSSProperties,
}



function CoinRow ({coin, style}: CoinRowProps) {

  const {savedCoins, toggleSavedCoin} = usePortfolioContext();

  function handlePercentage(percent: number) {


    const truncated = Math.trunc(percent * 10) / 10;
    const displayedPercent = Math.abs(truncated).toFixed(1);
    if (truncated >= 0) return (
      <span className="text-green-500 flex items-center justify-end">
        <span className="text-xs mx-1">&#9650;</span> {displayedPercent}%
      </span>
    );
    else return (
      <span className="text-red-500 flex items-center justify-end">
        <span className="text-xs mx-1">&#9660;</span> {displayedPercent}%
      </span>
    );
  }


  return (
    <>
      <tr className="border-t border-b border-gray-200 hover:bg-gray-100 transition-colors dark:hover:bg-gray-700" style={style}>
        <td className="text-right">

          <div className={`flex gap-2 items-center ${savedCoins[coin.id] ? "text-yellow-300": ""}`}>
            <svg className={`w-6 h-6 ${savedCoins[coin.id] ? "fill-current" : "fill-none"} cursor-pointer`}
              stroke='currentColor'
              viewBox='0 0 24 24'
              onClick={() => toggleSavedCoin(coin.id)}
            >
              <path strokeWidth="1.5" d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
            </svg>
            <span className="text-black dark:text-gray-400">{coin.market_cap_rank}</span>
          </div>
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
