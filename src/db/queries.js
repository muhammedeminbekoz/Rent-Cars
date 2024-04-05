const getUsers = 'SELECT * FROM users';
const getUserById = 'SELECT * FROM users WHERE id = ? ALLOW FILTERING'
const addUser = 'INSERT INTO users (id, firstname, lastname, email ,password) VALUES (uuid(), ?, ?, ?, ?)'
const checkUserExsist = 'SELECT id, email, password FROM users WHERE email = ? ALLOW FILTERING'
/*
Cassandra cannot guarantee that large amounts of data won’t have to scanned amount of data, even if the result is small.
If you know that the dataset is small, and the performance will be reasonable, add ALLOW FILTERING to allow the query to execute:

Cassandra, sonuç küçük olsa bile büyük miktarda verinin taranması gerekmeyeceğini garanti edemez.
Veri kümesinin küçük olduğunu ve performansın makul olacağını biliyorsanız, sorgunun yürütülmesine izin vermek için ALLOW FILTERING'i ekleyin:
Tablodaki primary key alanlarını kullanarak sorgu yapmak daha verimlidir. Ve ALLOW FILTERING kullanmak gerekmez.

*/

const listCity = 'SELECT city_name FROM cities WHERE city_name = ? ALLOW FILTERING';
const getCityId = 'SELECT city_id FROM cities WHERE city_name = ? ALLOW FILTERING';

const addOffice = 'INSERT into offices (office_id, city_id, office_name) VALUES (uuid(), ?, ?)'
const listOfficeByCity = 'SELECT * FROM  offices WHERE city_id = ? ALLOW FILTERING';

const getOfficeId = 'SELECT office_id FROM offices WHERE office_name = ? ALLOW FILTERING'
const listCars = 'SELECT * FROM cars WHERE rental_status = True AND office_id = ? ALLOW FILTERING'

module.exports = {
    getUsers,
    getUserById,
    addUser,
    checkUserExsist,
    listCity,
    getCityId,
    addOffice,
    listOfficeByCity,
    getOfficeId,
    listCars
}