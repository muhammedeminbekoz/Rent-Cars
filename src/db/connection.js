const cassandra = require('cassandra-driver');
require("dotenv").config();


const client = new cassandra.Client({
    contactPoints: [process.env.CONTACTPOINTS],
    keyspace: process.env.KEYSPACE,
    localDataCenter: process.env.LOCALDATACENTER
});

module.exports = client;