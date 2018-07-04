var userdao = require('./userdao')
var userfactory = require('../factory/userfactory')
var gestionaleLogger = require("../utility/gestionaleLogger");

userdao.readUser = function(req, res, connection, cb){
    gestionaleLogger.logger.debug('userdao');
    userfactory.readUser(req, res, connection,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

userdao.getUserById = function(id, connection,cb){
    gestionaleLogger.logger.debug('userdao-getUserById');
    userfactory.getUserById(id, connection,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

userdao.searchUtenti = function(filter, connection,cb){
    gestionaleLogger.logger.debug('userdao-searchUtenti');
    userfactory.searchUtenti(filter, connection,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

userdao.getUserByEmail = function(email, connection,cb){
    gestionaleLogger.logger.debug('userdao-getUserByEmail');
    userfactory.getUserByEmail(email, connection,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

userdao.getUserFromToken = function(token, connection,cb){
    gestionaleLogger.logger.debug('userdao-getUserFromToken');
    userfactory.getUserFromToken(token, connection,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}



userdao.getUserByNameAndPassword = function(username,password, connection,cb){
    gestionaleLogger.logger.debug('userdao-getUserByNameAndPassword');
    userfactory.getUserByNameAndPassword(username,password, connection,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

userdao.getUserByName = function(username,connection,cb){
    gestionaleLogger.logger.debug('userdao-getUserByNameAndPassword');
    userfactory.getUserByName(username, connection,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

userdao.adduser = function(username,password,email,idprofilo,enabled,force_change_pwd,connection,cb){
    gestionaleLogger.logger.debug('userdao-adduser');
    userfactory.adduser(username,password,email,idprofilo,enabled,force_change_pwd,connection,function(err,data){
        return cb(err,data)
    });
}

userdao.updateuser = function(idutente,username,password,email,idprofilo,enabled,force_change_pwd, token, expirationToken ,connection,cb){
    gestionaleLogger.logger.debug('userdao-adduser');
    userfactory.updateuser(idutente,username,password,email,idprofilo,enabled,force_change_pwd, token, expirationToken ,connection,function(data){
        return cb(data)
    });
}

userdao.deleteuser = function(id,connection,cb){
    gestionaleLogger.logger.debug('userdao-deleteuser');
    userfactory.deleteuser(id,connection,function(data){
        return cb(data)
    });
}

module.exports = userdao;