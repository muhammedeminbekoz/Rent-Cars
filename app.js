const express = require('express');
const client = require('./src/db/connection');
require('./src/db/connection');
const app = express();
app.use(express.json());





app.get('/', async (req, res) => {
    const query = 'SELECT * FROM kullanicilar';
    client.execute(query, (err, result) => {
        if (err) {
            console.log('Error', err);
        }
        else {
            console.log(result);
            res.json({ data: result.rows });

        }
    })


})

app.listen(3000, () => {
    console.log(`http://localhost:3000 is running`);
})