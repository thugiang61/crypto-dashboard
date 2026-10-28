// import React from 'react';

import React from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  strokeWidth?: number;
}

// export const StockSparkline: React.FC<SparklineProps> = ({
//   data,
//   width = 120,
//   height = 40,
//   strokeWidth = 2,
// }) => {
function Sparkline ({
  data,
  width = 150,
  height = 40,
  strokeWidth = 2,
}: SparklineProps) {
  if (!data || data.length === 0) return null;
  // console.log("display when click on SortArrow and update Dashbord's sortOption (before use react.memo for Sparkline)")

  const min = Math.min(...data);
  const max = Math.max(...data);
  const totalPoints = data.length;
  
  // Prevent division by zero if all values are identical
  const range = max - min === 0 ? 1 : max - min;

  // Map data array coordinates to fit inside the SVG viewBox boundary
  const points = data.map((val, index) => {
    const x = (index / (totalPoints - 1)) * width;
    // Invert Y axis because SVG (0,0) starts at the top-left corner
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  // Determine trend color (Green if final price >= starting price, else Red)
  const isPositive = data[data.length - 1] >= data[0];
  const strokeColor = isPositive ? '#22c55e' : '#ef4444'; // Tailwind green-500 / red-500

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export default React.memo(Sparkline);
