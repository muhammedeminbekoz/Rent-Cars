const getUsers = 'SELECT * FROM users';
const addUser = 'INSERT INTO users (id, firstname, lastname, email ,password) VALUES (uuid(), ?, ?, ?, ?)'
const checkUserExsist = 'SELECT id, email, password FROM users WHERE email = ? ALLOW FILTERING'
/*
Cassandra cannot guarantee that large amounts of data won’t have to scanned amount of data, even if the result is small.
If you know that the dataset is small, and the performance will be reasonable, add ALLOW FILTERING to allow the query to execute:

Cassandra, sonuç küçük olsa bile büyük miktarda verinin taranması gerekmeyeceğini garanti edemez.
Veri kümesinin küçük olduğunu ve performansın makul olacağını biliyorsanız, sorgunun yürütülmesine izin vermek için ALLOW FILTERING'i ekleyin:

*/

const listCity = 'SELECT city_name FROM cities where city_name = ? ALLOW FILTERING';




module.exports = {
    getUsers,
    addUser,
    checkUserExsist,
    listCity
}