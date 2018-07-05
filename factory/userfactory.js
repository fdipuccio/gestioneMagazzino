var userfactory = require('./userfactory');
var pool = require('../connection/connection.js'); // db is pool
var func = require('../connection/convertToNested.js');
var gestionaleLogger = require("../utility/gestionaleLogger");

var nestingOptions = [
    { tableName : 'us_profili', pkey: 'ID'},
    { tableName : 'us_utenti', pkey: 'IDUTENTE', fkeys:[{table:'us_profili',col:'IDPROFILO'}]}

];

userfactory.readProfili = function(req, res, connection,cb){
    gestionaleLogger.logger.debug('userfactory');
    connection.query('SELECT * from us_profili;',function(err, results) {
        if (err) {
            gestionaleLogger.logger.error('userfactory.readProfili - Internal error: ', err);
            return cb(err);
        }else {
            return cb(null,results)
        }
    });
};

userfactory.searchUtenti = function(filter, connection,cb){
    gestionaleLogger.logger.debug('userfactory-searchUtenti');
    var sql ='SELECT * FROM us_utenti where 1=1 ';

    if(filter){
        sql += " AND ( upper(USERNAME) like UPPER(concat('%', "+connection.escape(filter)+", '%'))  OR upper(EMAIL) like UPPER(concat('%', "+connection.escape(filter)+", '%')) ) ";
    }


    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        // error handling
        if (err){
            gestionaleLogger.logger.error('userfactory.getUserById - Internal error: ', err);
            return cb(err);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            // nestedRows = func.convertToNested(rows, nestingOptions);
            nestedRows=rows;
            gestionaleLogger.logger.debug(nestedRows);
            return cb(null,nestedRows)
        }
    });
};

userfactory.readUser = function(req, res, connection,cb){
    gestionaleLogger.logger.debug('userfactory');
    connection.query('SELECT * from us_utenti;',function(err, results) {
        if (err) {
            gestionaleLogger.logger.error('userfactory.readUser - Internal error: ', err);
            return cb(err);
        }else {
            return cb(null,results)
        }
    });
};

userfactory.getUserById = function(id,connection, cb){
    gestionaleLogger.logger.debug('userfactory-getUserById');
    //var sql ='SELECT * FROM users LEFT JOIN role ON role.user_id = users.id  where users.id = '+connection.escape(id);
    var sql ='SELECT * FROM us_utenti where  idutente = '+connection.escape(id);
    gestionaleLogger.logger.debug('sql',sql);
    connection.query({sql: sql, nestTables: true}, function (err, rows) {
        // error handling
        if (err){
            gestionaleLogger.logger.error('userfactory.getUserById - Internal error: ', err);
            return cb(err);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            // nestedRows = func.convertToNested(rows, nestingOptions);
            nestedRows=rows;
            gestionaleLogger.logger.debug(nestedRows);
            return cb(null,nestedRows)
        }
    });
};

userfactory.getUserByEmail = function(email,connection, cb){
    gestionaleLogger.logger.debug('userfactory-getUserByEmail');
    var sql ='SELECT * FROM us_utenti where  EMAIL = '+connection.escape(email);
    gestionaleLogger.logger.debug('sql',sql);
    connection.query({sql: sql, nestTables: false}, function (err, rows) {
        // error handling
        if (err){
            gestionaleLogger.logger.error('userfactory.getUserByEmail - Internal error: ', err);
            return cb(err);
        }
        else {
            gestionaleLogger.logger.debug('rows',rows);
            nestedRows=rows;
            gestionaleLogger.logger.debug(nestedRows);
            return cb(null,nestedRows)
        }
    });
};

userfactory.getUserByNameAndPassword = function(username,password, connection,cb){
    gestionaleLogger.logger.debug('userfactory-getUserByNameAndPassword');
    var sql ='SELECT * FROM us_utenti where  username = ? and password= MD5(?) ';
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql,[username,password], function (err, rows) {
        // error handling
        if (err){
            gestionaleLogger.logger.error('userfactory.getUserByNameAndPassword - Internal error: ', err);
            return cb(err);
        }
        else {
            return cb(null,rows)
        }

    });

};

userfactory.getUserByName = function(username, connection,cb){
    gestionaleLogger.logger.debug('userfactory-getUserByNameAndPassword');
    var sql ='SELECT * FROM us_utenti where  UPPER(username) = UPPER(?) ';
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql,[username], function (err, rows) {
        // error handling
        if (err){
            gestionaleLogger.logger.error('userfactory.getUserByName - Internal error: ', err);
            return cb(err);
        }
        else {
            return cb(null,rows)
        }

    });

};

userfactory.adduser = function(username,password,email,idprofilo,enabled,force_change_pwd,connection,cb){
    gestionaleLogger.logger.debug('userfactory-adduser');
// to do check se esiste	   
    strInsert="insert into us_utenti (username,password,email,idprofilo,enabled,force_change_pwd ) values (?,MD5(?),?,?,?,?);";
    gestionaleLogger.logger.debug('strInsert : ',strInsert);
    connection.query(strInsert,[username,password,email,idprofilo,enabled,force_change_pwd],function(err,results) {
        if (err) {
            gestionaleLogger.logger.error('userfactory.adduser - Internal error: ', err);
            return cb('KO',null);
        }else {
            gestionaleLogger.logger.debug("1 record inserted");
            return cb(null,results.insertId);
        }
    });
};

userfactory.updateuser = function(idutente,username,password,email,idprofilo,enabled,force_change_pwd, token, expirationToken ,connection,cb){
    gestionaleLogger.logger.debug('userfactory-updateuser');
    var updtStr="update us_utenti set ";
    updtStr+=(username!=undefined)?" username ="+connection.escape(username)+",":"";
    updtStr+=(password!=undefined)?" password =MD5("+connection.escape(password)+"),":"";
    updtStr+=(email!=undefined)?" email ="+connection.escape(email)+",":"";
    updtStr+=(idprofilo!=undefined)?" idprofilo ="+connection.escape(idprofilo)+",":"";
    updtStr+=(enabled!=undefined)?" enabled ="+connection.escape(enabled)+",":"";
    updtStr+=(force_change_pwd!=undefined)?" force_change_pwd ="+connection.escape(force_change_pwd)+",":"";
    updtStr+=(token!=undefined || token==null)?" RESET_PASSWORD_TOKEN ="+connection.escape(token)+",":" RESET_PASSWORD_TOKEN=null,";
    updtStr+=(expirationToken!=undefined || expirationToken==null)?" RESET_PASSWORD_EXPIRES =STR_TO_DATE("+connection.escape(expirationToken)+",'%e/%c/%Y %T'),":" RESET_PASSWORD_TOKEN=null,";
    updtStr= updtStr.substring(0, updtStr.length - 1);// elimino l'ultima vigola :)
    updtStr+= " where idutente ="+connection.escape(idutente);
    gestionaleLogger.logger.debug('updtStr',updtStr);

    connection.query(updtStr,function(error, results) {
        if (error) {
            gestionaleLogger.logger.error('userfactory.updateuser - Internal error: ', err);
            return cb('KO', null);
        }else {
            gestionaleLogger.logger.debug("Update done");
            return cb(null, 'OK')
        }
    });
};

userfactory.updateuserForgotPassword = function(idutente,token, expirationToken ,connection,cb){
    gestionaleLogger.logger.debug('userfactory-updateuserForgotPassword');
    var updtStr="update us_utenti set ";
    updtStr+=(token!=undefined || token==null)?" RESET_PASSWORD_TOKEN ="+connection.escape(token)+",":" RESET_PASSWORD_TOKEN=null ";
    updtStr+=(expirationToken!=undefined || expirationToken==null)?" RESET_PASSWORD_TOKEN =STR_TO_DATE("+connection.escape(expirationToken)+",'%e/%c/%Y %T'),":" RESET_PASSWORD_TOKEN=null ";
    updtStr= updtStr.substring(0, updtStr.length - 1);// elimino l'ultima vigola :)
    updtStr+= " where idutente ="+connection.escape(idutente);
    gestionaleLogger.logger.debug('updtStr',updtStr);

    connection.query(updtStr,function(err,results) {
        if (err) {
            gestionaleLogger.logger.error('userfactory.updateuserForgotPassword - Internal error: ', err);
            return cb('KO');
        }else {
            gestionaleLogger.logger.debug("Update done");
            return cb(null,'OK')
        }
    });
};

userfactory.getUserFromToken = function(token, connection,cb){
    gestionaleLogger.logger.debug('userfactory-getUserFromToken');
    var sql = "SELECT * FROM US_UTENTI WHERE RESET_PASSWORD_TOKEN = "+connection.escape(token)+" AND RESET_PASSWORD_EXPIRES>=NOW()";
    gestionaleLogger.logger.debug('sql',sql);
    connection.query(sql, function (err, rows) {
        // error handling
        if (err){
            gestionaleLogger.logger.error('userfactory.getUserFromToken - Internal error: ', err);
            return cb(err);
        }
        else {
            return cb(null,rows)
        }
    });
};


userfactory.deleteuser = function(id,connection,cb){
    gestionaleLogger.logger.debug('userfactory-deleteuser');
    deletestr="delete from us_utenti where idutente= "+connection.escape(id);
    connection.query(deletestr,function(err,results) {
        if (err) {
            gestionaleLogger.logger.error('userfactory.deleteuser - Internal error: ', err);
            return cb('KO');
        }else {
            gestionaleLogger.logger.debug("deleted");
            return cb(null,'OK')
        }
    });
};
module.exports = userfactory;