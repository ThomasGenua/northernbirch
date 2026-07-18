"use client";

import { useEffect, useState } from "react";
import { colors as C, fonts as F } from "@/lib/theme";

type Point = { date: string; price: number };

export default function Sparkline({ symbol, width = 300, height = 80, showLabels = true }: {
  symbol: string; width?: number; height?: number; showLabels?: boolean;
}) {
  const [data, setData] = useState<Point[]>([]);

  useEffect(() => {
    let live = true;
    fetch(`/api/market?history=${encodeURIComponent(symbol)}`)
      .then((r) => r.json())
      .then((d) => { if (live) setData(d.history ?? []); })
      .catch(() => {});
    return () => { live = false; };
  }, [symbol]);

  if (data.length < 2) {
    return <div style={{ width, height, background: "#fafafa", borderRadius: 8 }} />;
  }

  const prices = data.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const pad = 4;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;

  const points = data.map((p, i) => {
    const x = pad + (i / (data.length - 1)) * innerW;
    const y = pad + innerH - ((p.price - min) / range) * innerH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const rising = prices[prices.length - 1] >= prices[0];
  const stroke = rising ? C.green : C.red;
  const fillId = `spark-${symbol.replace(/[^a-zA-Z0-9]/g, "")}`;
  const areaPath = `M ${points[0]} L ${points.join(" L ")} L ${pad + innerW},${pad + innerH} L ${pad},${pad + innerH} Z`;

  return (
    <div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.18" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${fillId})`} />
        <polyline points={points.join(" ")} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      {showLabels && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontFamily: F.sans, fontSize: 10, color: "#bbb" }}>90 days ago</span>
          <span style={{ fontFamily: F.sans, fontSize: 10, color: stroke, fontWeight: 700 }}>
            {rising ? "▲" : "▼"} {(((prices[prices.length - 1] - prices[0]) / prices[0]) * 100).toFixed(1)}%
          </span>
          <span style={{ fontFamily: F.sans, fontSize: 10, color: "#bbb" }}>today</span>
        </div>
      )}
    </div>
  );
}
