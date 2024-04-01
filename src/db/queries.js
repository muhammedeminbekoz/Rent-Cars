const addUser = 'INSERT INTO users (id, firstname, lastname, email ,password) VALUES (uuid(), ?, ?, ?, ?)'
const checkUserExsist = 'SELECT id FROM users WHERE email = ? ALLOW FILTERING'

module.exports = {
    addUser,
    checkUserExsist
}