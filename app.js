const express = require('express');
require('dotenv').config();
const port = process.env.PORT || 3000;
const cors = require('cors');
require('module-alias/register');
const limiter = require('@middlewares/security/rateLimit')
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger')


const userRoutes = require('@routers/userRoutes');
const cityRoutes = require('@routers/cityRoutes');
const rentalRoutes = require('@routers/rentalRoutes');
const carsRoutes = require('@routers/carsRoutes');


const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", limiter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))




app.get('/', async (req, res) => {
    res.status(200).json('Hello World!');
})


app.use('/api/user', userRoutes);
app.use('/api/city', cityRoutes);
app.use('/api/rental', rentalRoutes);
app.use('/api/cars', carsRoutes);



app.listen(port, () => {
    console.log(`http://localhost:${port} is running`);
})

