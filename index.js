const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser')
const payments = require(path.join(__dirname, './cnt_modular/payments/route/api-payments.js'));
const cors = require('cors');

app.use(cors());
// app.use(cors({
//   origin: '*',  // Or specify your frontend URL like 'https://stageuser.alo-komak.ir' 
//   methods: ['GET', 'POST', 'OPTIONS'],
//   allowedHeaders: ['DNT', 'User-Agent', 'X-Requested-With', 'If-Modified-Since', 'Cache-Control', 'Content-Type', 'Range'],
//   exposedHeaders: ['Content-Length', 'Content-Range'],
//   credentials: true  // Only set this if you need to send cookies/auth headers
// })); 


app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use('/api', payments);

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
