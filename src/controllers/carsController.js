const client = require('../db/connection');
const query = require('../db/queries');



const listCarsByOffice = (req, res) => {
    const officeName = req.params.officename;

    client.execute(query.getOfficeId, [officeName], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "query error" })

        } else {
            const officeId = result?.rows[0]?.office_id;

            if (!officeId) {
                console.log('böyle bir ofis yok');
                res.status(400).json({ message: 'böyle bir ofis bulunmamaktadır' });
            }
            else {
                console.log(officeId)
                client.execute(query.listCars, [officeId], (err, result) => {
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


const addCar = (req, res) => {
    const { brand, carImage, fuelType, gearType, rentalStatus, officeId, rentalPrice } = req.body;

    client.execute(query.addCar, [brand, carImage, fuelType, gearType, rentalStatus, officeId, rentalPrice], (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: 'araba eklenirken hata oluştu' });
        }
        else {
            res.status(200).json({ message: 'araba eklendi', data: result })
        }
    })
}


module.exports = {
    listCarsByOffice,
    addCar
}