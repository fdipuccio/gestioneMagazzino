var articolidao = require('./articolidao')
var articolifactory = require('../factory/articolifactory')
var gestionaleLogger = require("../utility/gestionaleLogger");


articolidao.searchArticoli = function(filter, connection,cb){
	gestionaleLogger.logger.debug('articolidao  searchArticoli');
	articolifactory.searchArticoli(filter, connection,function(err, data){
        if (err) return cb(err);
		return cb(null,data)
    });
}


articolidao.readArticoliCategories = function(connection,cb){
	gestionaleLogger.logger.debug('articolidao  readArticoliCategories');	
	articolifactory.readArticoliCategories(connection,function(err, data){
		if (err) return cb(err);
		  return cb(null,data)
	  });
}


articolidao.readArticoliByCategory = function(idCategory, connection,cb){
	gestionaleLogger.logger.debug('articolidao  readArticoliByCategory');	
	articolifactory.readArticoliByCategory(idCategory, connection,function(err, data){
		if (err) return cb(err);
		  return cb(null,data)
	  });
}


articolidao.getArticoloById = function(id,connection,cb){
	gestionaleLogger.logger.debug('articolidao-getArticoloById');
	  articolifactory.getArticoloById(id,connection, function(err, data){
          if (err) return cb(err);
			return cb(null,data)
        });
}

articolidao.getArticoloByCode = function(code,connection,cb){
	gestionaleLogger.logger.debug('articolidao-getArticoloByCode');
	articolifactory.getArticoloByCode(code,connection, function(err, data){
		if (err) return cb(err,null);
		  return cb(null,data)
	  });
}



articolidao.addArticolo = function(articolo,connection,cb){
	gestionaleLogger.logger.debug('articolidao-addArticolo');
	articolifactory.addArticolo(articolo,connection,function(err,data){
		return cb(err, data)
    });
}	
		
articolidao.updateArticolo = function(articolo,idArticolo,connection,cb){
	gestionaleLogger.logger.debug('articolidao-updateArticolo');
	  articolifactory.updateArticolo(articolo,idArticolo,connection,function(error,data){
			return cb(error, data)
        });
}

articolidao.deleteArticolo = function(id,connection,cb){
	gestionaleLogger.logger.debug('articolidao-deleteArticolo');
	  articolifactory.deleteArticolo(id,connection,function(error,data){
			return cb(error, data)
        });
}

module.exports = articolidao;