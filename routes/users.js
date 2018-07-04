var express = require('express')
var router = express.Router();
var usercontroller = require('../controller/usercontroller');
var accesscontrol = require('../security/accesscontrol');
var gestionaleLogger = require("../utility/gestionaleLogger");


/* GET users listing. */
router.get('/', accesscontrol.isLoggedIn,function(req, res, next) {
usercontroller.readUser(req, res, function(err, data){
  gestionaleLogger.logger.debug(data);
       var sess=req.session;
       userSession=sess.userSession;
          if (err) return next(err);
			res.end(JSON.stringify(data));
        });
});

router.get('/:idutente',accesscontrol.isLoggedIn, function(req, res, next) {
  usercontroller.getUserById(req, res, function(err, data){
  gestionaleLogger.logger.debug(data);
          if (err) return next(err);
			res.end(JSON.stringify(data));
        });

});

router.post('/reset/:token', function(req, res, next) {
  usercontroller.resetPassword(req, res, function(err, data){
    if (err) return next(err);
	  res.end(JSON.stringify(data));
  });
});

router.post('/search', function(req, res, next) {
  usercontroller.searchUtenti(req, res, function(err, data){
    if (err) return next(err);
	  res.end(JSON.stringify(data));
  });
});

router.get('/reset/:token', function(req, res, next) {
  usercontroller.checkResetPassword(req, res, function(ret){
    res.end(JSON.stringify(ret));
  });
});

router.post('/forgot',accesscontrol.isLoggedIn, function(req, res, next) {
  usercontroller.forgotPassword(req, res, function(err, data){
    if (err) return next(err);
	  res.end(JSON.stringify(data));
  });
});

router.post('/email',accesscontrol.isLoggedIn, function(req, res, next) {
  usercontroller.getUserByEmail(req, res, function(err, data){
    if (err) return next(err);
	  res.end(JSON.stringify(data));
  });

});

router.post('/adduser', accesscontrol.isLoggedIn,function(req, res) {
gestionaleLogger.logger.debug('adduser: '+req.body);
  usercontroller.adduser(req, res, function(err,data){
    if (err)  res.end(JSON.stringify(err));
    res.end(JSON.stringify(data));
        });
  
});

router.put('/updateuser/:idutente',accesscontrol.isLoggedIn, function(req, res) {
gestionaleLogger.logger.debug('adduser: '+req.body);
  usercontroller.updateuser(req, res, function(err,data){
    if (err) return res.end(JSON.stringify(err));
     res.end(JSON.stringify(data));
     });
 });
  



router.post('/cngpassword/',accesscontrol.isLoggedIn, function(req, res) {
  gestionaleLogger.logger.debug('cngpassword: '+req.body);
  usercontroller.changePassword(req, res, function(data){
    res.send(data);
  });
});


router.delete('/deleteuser/:idutente',accesscontrol.isLoggedIn, function (req, res) {
gestionaleLogger.logger.debug('deleteuser: '+req.params.idutente);
  usercontroller.deleteuser(req, res, function(err,data){
    if (err) return next(err);
     res.end(JSON.stringify(data));
     });
});


module.exports = router;


