const getUsers = 'SELECT * FROM users';
const getUserById = 'SELECT * FROM users WHERE id = ? ALLOW FILTERING'
const addUser = 'INSERT INTO users (id, firstname, lastname, email ,password, verifycode,isverify) VALUES (uuid(), ?, ?, ?, ?,?, false)'
const checkUserExsist = 'SELECT id, email, password FROM users WHERE email = ? ALLOW FILTERING'
const updateUser = 'UPDATE users SET firstname = ?, lastname = ?, password= ? WHERE id = ?'
const verifyUser = 'SELECT id, verifycode from users WHERE email = ? ALLOW FILTERING';
const updateUserVerifycode = 'UPDATE users SET verifycode = ? WHERE id = ?';
const chechkUserisVerifyed = 'SELECT * from users WHERE email = ? ALLOW FILTERING';
const getUserPassword = 'SELECT password from users WHERE id = ?';
const deleteUser = 'DELETE FROM users WHERE id = ?';
const resetPassword = 'UPDATE users SET password = ? WHERE id = ?';
;

/*
Cassandra cannot guarantee that large amounts of data won’t have to scanned amount of data, even if the result is small.
If you know that the dataset is small, and the performance will be reasonable, add ALLOW FILTERING to allow the query to execute:

Cassandra, sonuç küçük olsa bile büyük miktarda verinin taranması gerekmeyeceğini garanti edemez.
Veri kümesinin küçük olduğunu ve performansın makul olacağını biliyorsanız, sorgunun yürütülmesine izin vermek için ALLOW FILTERING'i ekleyin:
Tablodaki primary key alanlarını kullanarak sorgu yapmak daha verimlidir. Ve ALLOW FILTERING kullanmak gerekmez.

*/

const listCity = 'SELECT city_name FROM cities WHERE city_name = ? ALLOW FILTERING';
const getCityId = 'SELECT city_id FROM cities WHERE city_name = ? ALLOW FILTERING';
const getCityIds = 'SELECT city_name,city_id FROM cities';

/* update cities set offices = offices + [{office_id : uuid(),office_name :  'Sürmene ofisi'}] where city_id = 2871e28c-90a7-4876-
8a03-3d5dec871f53; */

const addOffice = 'INSERT into offices (office_id, city_id, office_name) VALUES (uuid(), ?, ?)'
const getOffices = 'SELECT * FROM  offices';
const getOfficeId = 'SELECT office_id FROM offices WHERE office_name = ? ALLOW FILTERING'
const getOfficeById = 'SELECT * FROM offices WHERE office_id = ?'

const listCars = 'SELECT * FROM cars WHERE office_id = ? ALLOW FILTERING'
const addCar = 'INSERT INTO cars (car_id, brand,car_image, fuel_type, gear_type, rental_status, office_id,rental_price) VALUES (uuid(), ?, ?, ?, ?, ?, ?, ?)';
const getCarIdBylastDropoffDate = 'SELECT car_id from cars WHERE last_dropoff_date = ? ALLOW FILTERING';


const changeCarInfos = 'UPDATE cars SET rental_status = ? , office_id = ?, last_dropoff_date = ? WHERE car_id = ?';
const changeRentalStatus = 'UPDATE cars SET rental_status = ? WHERE car_id = ?';
const getRentedCars = 'SELECT * from cars WHERE rental_status = false ALLOW FILTERING'

const getRentalInfo = 'SELECT * FROM rentalinfo';
const addResultOfRental = 'INSERT INTO rentalinfo (rental_id, car_id, driving_licance, dropoff_date, dropoff_officeid, phone_number, pickup_date, pickup_officeid, user_id) VALUES (uuid(), ?, {firstname : ? , lastname : ? , starting_date : ? , ending_date : ? , licance_no : ? , tck_no : ? , dob : ? }, ?, ?, ?, ?, ?, ? )'

//const addResultOfRental = 'INSERT INTO rentalinfo (rental_id, car_id, driving_licance, dropoff_date, dropoff_officeid, phone_number, pickup_date, pickup_officeid, user_id) VALUES (uuid(), ?,{firstname: ?, lastname : ?, starting_date: null, ending_date : null, licance_no : ?, tck_no : ?, dob : null }, null, ?, ?, null, ?, null)'


// truncate table rentalinfo; komutunu kullanarak bir tablo içerisindeki tüm kayıtları silebiliriz.
//delete age from users where id = bf4a147d-98a4-400e-a6ae-fe8cac5f4e1c; tablodaki sadece ilgili sütun silinir.

/* insert into rentalinfo (rental_id, car_id , 
    driving_licance, 
    dropoff_date, 
    dropoff_office, 
    pickup_date, 
    pickup_office, 
    user_id) 
    VALUES (uuid(), 
    uuid(), 
    {firstname : 'Muhammed Emin', lastname: 'Beköz', starting_date: '2020-12-02', ending_date : '2030-12-08', licance_no : '123456', tck_no : '12345678910', dob: '2002-08-15'}, 
    '2024-04-30 12:00:00', 
    {office_id : uuid(), office_name: 'Of ofisi'},
 '2024-04-20 12:00:00', 
 {office_id : uuid(), office_name : 'Of ofisi'},
  uuid()); */


module.exports = {
    getUsers,
    getUserById,
    addUser,
    checkUserExsist,
    updateUser,
    verifyUser,
    updateUserVerifycode,
    chechkUserisVerifyed,
    getUserPassword,
    deleteUser,
    resetPassword,
    listCity,
    addCar,
    getCarIdBylastDropoffDate,
    getCityId,
    getCityIds,
    addOffice,
    getOffices,
    getOfficeId,
    getOfficeById,
    listCars,
    changeCarInfos,
    changeRentalStatus,
    getRentedCars,
    getRentalInfo,
    addResultOfRental

}