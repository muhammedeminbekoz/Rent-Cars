const express = require('express');
const client = require('./src/db/connection');
require('./src/db/connection');
const userRoutes = require('./src/routers/userRoutes')
const app = express();
app.use(express.json());


app.get('/', async (req, res) => {
    res.status(200).json('Hello World!');
})


app.use('/api/user', userRoutes);




app.listen(3000, () => {
    console.log(`http://localhost:3000 is running`);
})