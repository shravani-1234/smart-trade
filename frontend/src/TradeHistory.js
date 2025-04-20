import { useEffect, useState } from "react";
import axios from "axios";

const TradeHistory = () => {
  const [trades, setTrades] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/trade/history?page=${page}`);
        setTrades(data.trades);
        setTotal(data.total);
      } catch (err) {
        console.error("Error fetching trade history:", err);
      }
    };
    fetchTrades();
  }, [page]);

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="mt-10 max-w-5xl mx-auto bg-white rounded shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Trade History</h2>
      <p className="mb-2 text-sm text-gray-600">{start}–{end} / {total}</p>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Product</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Source</th>
            <th className="p-2 border">Dest</th>
            <th className="p-2 border">Cost Price</th>
            <th className="p-2 border">Selling Price</th>
            <th className="p-2 border">Converted Cost</th>
            <th className="p-2 border">Discount (%)</th>
            <th className="p-2 border">Profit</th>
            <th className="p-2 border">Margin %</th>
            <th className="p-2 border">Tag</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Trade Date</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade, index) => (
            <tr key={index} className="text-sm text-center">
              <td className="p-2 border">{trade.product_name}</td>
              <td className="p-2 border">{trade.quantity}</td>
              <td className="p-2 border">{trade.source_currency}</td>
              <td className="p-2 border">{trade.destination_currency}</td>
              <td className="p-2 border">{trade.cost_price}</td>
              <td className="p-2 border">{trade.selling_price}</td>
              <td className="p-2 border">{trade.converted_cost}</td>
              <td className="p-2 border">{trade.discount}</td>
              <td className="p-2 border">{trade.profit}</td>
              <td className="p-2 border">{trade.margin_percent}</td>
              <td className="p-2 border">{trade.profit_tag}</td>
              <td className="p-2 border">{trade.trade_type}</td>
              <td className="p-2 border">{new Date(trade.trade_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-gray-300 px-4 py-1 rounded disabled:opacity-50"
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <button
          className="bg-gray-300 px-4 py-1 rounded disabled:opacity-50"
          onClick={() => setPage(prev => (end < total ? prev + 1 : prev))}
          disabled={end >= total}
        >
          Next
        </button>
      </div>
      <a
        href="http://localhost:5000/api/trade/history/csv"
        download="tradeHistory.csv"
        className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
        Download CSV
      </a>
    </div>
  );
};

export default TradeHistory;
