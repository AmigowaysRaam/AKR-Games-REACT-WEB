require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const PORT = process.env.PORT || 5050;

const pool = require('./config/db');
const akrRoutes = require('./routes/AkrRoutes');
const bannerroutes =require('./routes/bannerManagements') 
const popuproutes =require('./routes/popupManagements') 
const rechargeroutes =require('./routes/rechargeRoutes') 


const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

const UPLOAD_DIR = './uploads';
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOAD_DIR));

// all AkR routes including /health
app.use('/', akrRoutes);
app.use ('/',bannerroutes)
app.use ('/',popuproutes )
app.use ('/',rechargeroutes )

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});