import { useState } from "react";
import axios from "axios";

const TradeForm = () => {
  const [form, setForm] = useState({
    product_name: "",
    quantity: 0,
    source_currency: "USD",
    destination_currency: "USD",
    cost_price: 0,
    selling_price: 0,
    trade_type: "Import"
  });

  const [result, setResult] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { data } = await axios.post("http://localhost:5000/api/trade/evaluate", form);
    setResult(data);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        {["product_name", "quantity", "cost_price", "selling_price"].map(field => (
          <input
            key={field}
            name={field}
            type="text"
            placeholder={field.replace("_", " ")}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        ))}
        <select name="source_currency" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="USD">USD</option>
          <option value="INR">INR</option>
          <option value="EUR">EUR</option>
        </select>
        <select name="destination_currency" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="USD">USD</option>
          <option value="INR">INR</option>
          <option value="EUR">EUR</option>
        </select>
        <select name="trade_type" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="Import">Import</option>
          <option value="Export">Export</option>
        </select>
        <button className="bg-blue-500 text-white p-2 rounded">Evaluate Trade</button>
      </form>

      {/* {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <p><strong>Profit:</strong> {result.profit}</p>
          <p><strong>Margin:</strong> {result.margin_percent}%</p>
          <p>
            <strong>Tag:</strong>{" "}
            <span
              className={`font-bold ${
                result.profit_tag === "Loss"
                  ? "text-red-600"
                  : result.profit_tag === "Low Margin"
                  ? "text-yellow-500"
                  : result.profit_tag === "Medium Margin"
                  ? "text-green-500"
                  : "text-blue-500"
              }`}
            >
              {result.profit_tag}
            </span>
          </p>
        </div>
      )} */}
      {result && (
  <div className="mt-6 bg-gray-100 p-4 rounded shadow space-y-2">
    <p><strong>Total Cost (converted):</strong> {result.converted_cost}</p>
    <p><strong>Discount:</strong> {result.discount}%</p>
    {/* <p><strong>Revenue:</strong> {selling_price*quantity}%</p> */}
    <p><strong>Profit:</strong> {result.profit}</p>
    <p><strong>Margin:</strong> {result.margin_percent}%</p>
    <p>
      <strong>Tag:</strong>{" "}
      <span
        className={`font-bold ${
          result.profit_tag === "Loss"
            ? "text-red-600"
            : result.profit_tag === "Low Margin"
            ? "text-yellow-500"
            : result.profit_tag === "Medium Margin"
            ? "text-blue-500"
            : "text-green-500"
        }`}
      >
        {result.profit_tag}
      </span>
    </p>
  </div>
)}

    </div>
  );
};

export default TradeForm;
