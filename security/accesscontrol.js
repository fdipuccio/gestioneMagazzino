var 	accesscontrol = require('./accesscontrol');



accesscontrol.isLoggedIn = function (req, res, next){
	var sess=req.session;
	/*if(sess.userSession == undefined){
		console.log ("The user is not logged in, redirect to the home page");
		return res.redirect("/");
	}*/
	return next();
	
};

module.exports = accesscontrol;


