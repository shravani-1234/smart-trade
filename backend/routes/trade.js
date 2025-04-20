const express = require("express");
const axios = require("axios");
const Trade = require("../models/trade");
const router = express.Router();

router.post("/evaluate", async (req, res) => {
  try {
    const {
        product_name,
        source_currency,
        destination_currency,
        trade_type
      } = req.body;
      
      const quantity = Number(req.body.quantity);
      const cost_price = Number(req.body.cost_price);
      const selling_price = Number(req.body.selling_price);
      

    const costTotal = cost_price * quantity;

    // Fetch live currency conversion
    const { data } = await axios.get('https://api.exchangerate.host/convert', {
        params: {
          from: source_currency,
          to: destination_currency,
          amount: costTotal,
          access_key: 'af6f364155c3f678049147d114fb3e97' // if required
        }
      });
      

    

    console.log("API Response:", data);  

    const converted_cost = data.result;

    // Apply discount
    let discount = 0;
    if (quantity > 1000) discount = 10;
    else if (quantity > 500) discount = 5;

    const discounted_cost = converted_cost * (1 - discount / 100);
    const revenue = selling_price * quantity;
    const profit = revenue - discounted_cost;
    const margin_percent = ((profit / discounted_cost) * 100).toFixed(2);

    // Tag
    let profit_tag = "Loss";
    if (profit > 0) {
      if (margin_percent < 10) profit_tag = "Low Margin";
      else if (margin_percent < 30) profit_tag = "Medium Margin";
      else profit_tag = "High Margin";
    }

    const newTrade = new Trade({
      product_name,
      quantity,
      source_currency,
      destination_currency,
      cost_price,
      selling_price,
      converted_cost: converted_cost.toFixed(2),
      discount,
      profit: profit.toFixed(2),
      margin_percent,
      profit_tag,
      trade_type
    });


    await newTrade.save();

    res.json(newTrade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Evaluation failed" });
  }
});

router.get("/history", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 5;
  
      const total = await Trade.countDocuments();
      const trades = await Trade.find()
        .sort({ trade_date: -1 }) // sort by trade_date in descending order
        .skip((page - 1) * limit)
        .limit(limit);
  
      res.json({
        trades,
        total
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch trade history" });
    }
  });


  const { Parser } = require('json2csv');

  router.get("/history/csv", async (req, res) => {
    try {
      const trades = await Trade.find().sort({ trade_date: -1 });
  
      const fields = [
        "product_name", "quantity", "source_currency", "destination_currency",
        "cost_price", "selling_price", "converted_cost", "discount",
        "profit", "margin_percent", "profit_tag", "trade_type", "trade_date"
      ];
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(trades);
  
      res.header("Content-Type", "text/csv");
      res.attachment("tradeHistory.csv");
      res.send(csv);
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to export CSV");
    }
  });
  
  
  

module.exports = router;
