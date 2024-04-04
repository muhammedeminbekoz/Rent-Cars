const express = require('express');
require('dotenv').config();
const port = process.env.PORT || 1903;


const userRoutes = require('./src/routers/userRoutes');
const cityRoutes = require('./src/routers/cityRoutes');
const app = express();
app.use(express.json());


app.get('/', async (req, res) => {
    res.status(200).json('Hello World!');
})


app.use('/api/user', userRoutes);
app.use('/api/city', cityRoutes);




app.listen(port, () => {
    console.log(`http://localhost:3000 is running`);
})

