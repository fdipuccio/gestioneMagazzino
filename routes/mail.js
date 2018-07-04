var express = require('express')
var router = express.Router();
var mailcontroller = require('../controller/mailcontroller');
var accesscontrol = require('../security/accesscontrol');
var gestionaleLogger = require("../utility/gestionaleLogger");





router.post('/sendReminder',accesscontrol.isLoggedIn, function(req, res) {
    gestionaleLogger.logger.debug('sendReminder: '+req.body);
    mailcontroller.sendReminder(req, res, function(data){
        res.send(JSON.stringify(data));
    });  
});



module.exports = router;