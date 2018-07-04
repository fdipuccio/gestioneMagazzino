var express = require('express')
var router = express.Router();
var valutecontroller = require('../controller/valutecontroller');
var accesscontrol = require('../security/accesscontrol');
var gestionaleLogger = require("../utility/gestionaleLogger");


router.get('/',accesscontrol.isLoggedIn, function(req, res, next) {
  valutecontroller.getValute(req, res, function(err, data){
  gestionaleLogger.logger.debug(data);
          if (err) return next(err);
			res.end(JSON.stringify(data));
        });
});

module.exports = router;


