const express = require('express');
const app = express();
const errorHandler = require('./middleware/errorHandler')
const routes = require('./routes/index');
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');

require('dotenv').config();

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,  
    methods: ['GET','POST', 'PUT', 'DELETE', 'PATCH' ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// File upload middleware
app.use(fileUpload());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(routes)
app.get('/', (req,res) =>{        
    res.send('Welcome to Bookswap Backend');
})

app.use(errorHandler)


const PORT = process.env.PORT || 9000;
app.listen(PORT, () =>{
    console.log('Server is running on port ' , PORT);
})