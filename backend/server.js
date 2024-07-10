const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const config = {
    user: process.env.DB_USER || 'agritayo',
    password: process.env.DB_PASSWORD || 'Irregular4',
    server: process.env.DB_SERVER || 'agritayo.database.windows.net',
    port: process.env.DB_PORT || 1433,
    database: process.env.DB_NAME || 'AgriTayo',
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
};

app.get('/api/data', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM dbo.sample');
        
        // Log the data received from the database
        console.log('Data from database:', result.recordset);
        
        res.json(result.recordset);
    } catch (err) {
        console.error('Error executing SQL query:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 8081;

const distPath = path.join(__dirname, '../frontend/dist/');
app.use(express.static(distPath));

app.get('*', (req, res) => {
    res.sendFile('index.html', { root: distPath });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
