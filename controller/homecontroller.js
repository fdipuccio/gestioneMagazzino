'use strict';
var homecontroller = require('./homecontroller');
var homeservice = require('../service/homeservice')
var configservice = require('../service/configservice')
var encrypt = require('../utility/encryption');
var config = require('../utility/config');
var gestionaleLogger = require("../utility/gestionaleLogger");


homecontroller.getDatiAlertScadenza= function (req, res, cb){
    gestionaleLogger.logger.debug('homecontroller- getDatiAlertScadenza');
    homeservice.getDatiAlertScadenza(function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}



homecontroller.getDatiAlertQuantita= function (req, res,cb){
    gestionaleLogger.logger.debug('homecontroller- getDatiAlertQuantita');
    homeservice.getDatiAlertQuantita(function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });

}

module.exports = homecontroller;
