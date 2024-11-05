const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');

const app = express();
const port = 3000;
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


const pool = new Pool({
    user: 'postgres',       // Replace with your PostgreSQL username if different
    host: 'localhost',      // or '127.0.0.1'
    database: 'hodlinfo',   // The database you created
    password: '2002', // Replace with your PostgreSQL password
    port: 5432,             // Default PostgreSQL port
  });
  

// Fetch data from WazirX API and store in the database
const fetchData = async () => {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const data = Object.values(response.data).slice(0, 10);

    await pool.query('DELETE FROM tickers'); // Clear existing data

    for (const item of data) {
      await pool.query(
        'INSERT INTO tickers (name, last, buy, sell, volume, base_unit) VALUES ($1, $2, $3, $4, $5, $6)',
        [item.name, item.last, item.buy, item.sell, item.volume, item.base_unit]
      );
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

fetchData();

// Route to get data from database
app.get('/api/tickers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tickers');
    res.json(result.rows);
  } catch (error) {
    res.status(500).send('Error retrieving data');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
