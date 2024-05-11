const client = require('../db/connection');
const query = require('../db/queries');




const addOffice = async (req, res) => {
    const { office_name, city_name } = req.body;

    const result = await client.execute(query.getCityId, [city_name]);
    const cityId = result.rows[0].city_id;

    await client.execute(query.addOffice, [cityId, office_name], (err, result) => {
        if (err) res.status(400).json({ success: false, message: 'server error' });
        else {
            res.status(200).json({ message: 'office added successfully' });
        }
    })
};

const listOffices = async (req, res) => {

    // const cityName = req.params.cityname;
    client.execute(query.getOffices, async (err, result) => {
        if (err) {
            res.status(400).json({ success: false, message: "server error" })
        }

        else {
            let cities = await new Promise((resolve, reject) => {
                client.execute(query.getCityIds, (err, result) => {
                    if (err) { reject(err); }
                    else { resolve(result); }
                });
            });

            var response = result.rows.map(item => {
                let searchValue = cities.rows.find(city => city.city_id.toString() === item.city_id.toString())?.city_name;

                return { key: item.office_id, value: item.office_name, searchValue: searchValue ? `${searchValue} ${item.office_name}` : 'kayıt yok' };
            })

            res.status(200).json({ data: response });
        }
    })

}

module.exports = {
    addOffice,
    listOffices
}