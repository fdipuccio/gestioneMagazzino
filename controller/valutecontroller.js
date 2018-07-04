'use strict';
var valutecontroller = require('./valutecontroller');
var valuteservice = require('../service/valuteservice')
var gestionaleLogger = require("../utility/gestionaleLogger");


valutecontroller.getValute = function(req, res, cb){
    gestionaleLogger.logger.debug('valutecontroller- getValute');
    valuteservice.getValute(function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

module.exports = valutecontroller;
