const client = require('../db/connection');
const query = require('../db/queries');




const addOffice = async (req, res) => {
    const { office_name, city_name } = req.body;

    const result = await client.execute(query.getCityId, [city_name]);
    const cityId = result.rows[0].city_id;
    console.log(cityId);


    await client.execute(query.addOffice, [cityId, office_name], (err, result) => {
        if (err) console.log(err);
        else {
            res.status(200).json({ message: 'office added successfully' });
        }
    })
};

const listOfficesBycity = async (req, res) => {

    const cityName = req.params.cityname;
    client.execute(query.getCityId, [cityName], (err, result) => {
        if (err) console.log(err);
        else {
            const cityId = result.rows[0].city_id;
            client.execute(query.listOfficeByCity, [cityId], (err, result) => {
                if (err) console.log(err);
                else {
                    res.status(200).json({ data: result.rows })
                }
            })
        }
    })

}

module.exports = {
    addOffice,
    listOfficesBycity
}