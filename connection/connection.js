var mysql = require('mysql');
var connectionpool = mysql.createPool({
	connectionLimit:20,
    host     : 'localhost',
    user     : 'gestionale',
	password : 'gestionale',
	port: 3306,
	database: 'gestMagazzino'
});

module.exports.getConnection = function (callback) {
    connectionpool.getConnection(callback);
};

