var valutedao = require('./valutedao')
var valutefactory = require('../factory/valutefactory')
var gestionaleLogger = require("../utility/gestionaleLogger");


valutedao.getValute = function(connection, cb){
    gestionaleLogger.logger.debug('valutedao-getvalutes');
    valutefactory.getValute(connection,function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

module.exports = valutedao;