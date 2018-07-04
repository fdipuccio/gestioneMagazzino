var express = require('express');
var router = express.Router();
var logincontroller = require('../controller/logincontroller');
var gestionaleLogger = require("../utility/gestionaleLogger");

router.post('/checklogin', function(req, res, next) {
    logincontroller.checkLogin(req, res, function(err, data){
        
        if (err) return next(err);
        
        // Utente in sessione
        var sess=req.session;
        var jsonuser=JSON.stringify(data);
        sess.userSession=jsonuser;
        res.send(jsonuser);
    });
});

router.post('/resetPassword', function(req, res, next) {
    logincontroller.resetPassword(req, res, function(err, data){
        if (err) return next(err);
        console.log(JSON.stringify(data))
        res.send(data);
    });
});

router.get('/logout', function(req, res, next) {
    var sess=req.session;
     sess.destroy();
        console.log('Sessione Invalidata')
        res.send("LOGOUT");

});

module.exports = router;
