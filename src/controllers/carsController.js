
const client = require('../db/connection');
const qeury = require('../db/queries');



const listCarsByOffice = (req, res) => {
    const officeName = req.params.officename;

    client.execute(qeury.getOfficeId, [officeName], (err, result) => {
        if (err) console.log(err);
        else {
            const officeId = result.rows[0].office_id;

            if (!officeId) {
                console.log('böyle bir ofis yok');
                res.status(400).json({ message: 'böyle bir ofis bulunmamaktadır' });
            }
            else {
                console.log(officeId)
                client.execute(qeury.listCars, [officeId], (err, result) => {
                    if (err) console.log(err);
                    else {
                        if (!result.rowLength) {
                            res.status(200).json({ message: 'ofiste kiralamaya uygun araç bulunmamaktadır' });
                        }

                        res.status(200).json({ data: result.rows })
                    }
                });
            }

        }
    })


}

module.exports = {
    listCarsByOffice
}