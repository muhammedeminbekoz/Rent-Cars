require('module-alias/register')
const client = require('@db/connection');
const query = require('@db/queries');
const nodecron = require('node-cron')



const listCarsByOffice = (req, res) => {
    const officeName = req.params.officename;
    client.execute(query.getOfficeId, [officeName], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: "query error" })

        } else {
            const officeId = result?.rows[0]?.office_id;

            if (!officeId) {
                res.status(400).json({ message: 'böyle bir ofis bulunmamaktadır' });
            }
            else {
                client.execute(query.listCars, [officeId], (err, result) => {
                    if (err) res.status(400).json({ success: false, message: "server error" });
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

    client.execute(query.addCar, [brand, carImage, fuelType, gearType, rentalStatus, officeId, rentalPrice], { prepare: true }, (err, result) => {
        if (err) {
            res.status(400).json({ success: false, message: 'server eror' });
        }
        else {
            res.status(200).json({ success: true, message: 'araba eklendi', })
        }
    })
}


const changeCarStatus = (req, res) => {
    try {

        client.execute(query.getRentedCars, (err, result) => {
            if (err) res.status(400).json({ success: false, message: "server error" })
            else if (result?.rowLength == 0) {
                res.status(404).json({ success: true, message: "şu anda kiralanmış araç bulunmamaktadır" })
            }
            else {
                const rentedCarsDate = []
                result.rows.map(value => {
                    rentedCarsDate.push(value.last_dropoff_date)
                })

                nodecron.schedule('*/30 * * * *', () => { // Her 30 dakikada bir çalışacak şekilde ayarlandı,
                    const today = new Date();

                    rentedCarsDate.forEach((dropoffDate) => {
                        const carDropoffDate = new Date(dropoffDate);
                        if (carDropoffDate < today) {
                            client.execute(query.getCarIdBylastDropoffDate, [dropoffDate], (err, result) => {
                                if (err) res.status(400).json({ success: false, message: "server error" })
                                else {
                                    const carId = result?.rows[0]?.car_id;

                                    client.execute(query.changeRentalStatus, [true, carId], (err, result) => {
                                        if (err) res.status(400).json({ success: false, message: "server err" })
                                        else {
                                            console.log('this car rental_status changed from false to true :', carId);
                                        }
                                    })

                                }
                            })
                        }
                    });
                });

                res.status(200).json({ success: true, data: result.rows })

            }
        })
    }
    catch (err) {
        res.status(400).json({ success: false, message: "server error" })
    }


}


module.exports = {
    listCarsByOffice,
    addCar,
    changeCarStatus
}