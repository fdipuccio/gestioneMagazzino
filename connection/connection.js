var mysql = require('mysql');
var connectionpool = mysql.createPool({
	connectionLimit:20,
    host     : 'localhost',
    //host     : '212.237.40.240',
	 user     : 'gestionale',
	 password : 'gestionale',
	 port: 3306,
	 database: 'gestionale'
});

module.exports.getConnection = function (callback) {
    connectionpool.getConnection(callback);
};

