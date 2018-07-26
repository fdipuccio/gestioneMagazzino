var fornitoridao = require('./fornitoridao')
var fornitorifactory = require('../factory/fornitorifactory')
var gestionaleLogger = require("../utility/gestionaleLogger");

fornitoridao.exportSuppliers = function(suppliersFilter, connection, cb){
    gestionaleLogger.logger.debug('exportSuppliers');
    fornitorifactory.readSuppliers(cb, suppliersFilter, connection, function(err, data){
        if (err) return cb(err);
          return cb(null,data)
      });
}


fornitoridao.advancedSearch= function(filter,connection,cb){
    gestionaleLogger.logger.debug('fornitoridao-advancedSearch');
    fornitorifactory.advancedSearch(filter,connection, function(err, data){
        if (err) return cb(err);
        return cb(null,data)
    });
}

fornitoridao.getSupplierById = function(id, connection, cb){
	gestionaleLogger.logger.debug('fornitoridao-getSupplierById');
	  fornitorifactory.getSupplierById(id, connection,function(err, data){
          if (err) return cb(err);
			return cb(null,data[0])
        });
}


fornitoridao.canBeDeleted = function(id, connection, cb){
	gestionaleLogger.logger.debug('fornitoridao-canBeDeleted');
	  fornitorifactory.canBeDeleted(id, connection,function(err, data){
          if (err) return cb(err);
			return cb(null,data[0])
        });
}

fornitoridao.addSupplier = function(supplier, connection, cb){
    gestionaleLogger.logger.debug('fornitoridao-addSupplier');
    fornitorifactory.addSupplier(supplier, connection,function(err,data){
        return cb(err,data)
    });
}

		
fornitoridao.updateSupplier = function(id,fornitore, connection, cb){
	gestionaleLogger.logger.debug('fornitoridao-updateSupplier');
	  fornitorifactory.updateSupplier(id, fornitore, connection, function(err,data){
			return cb(err,data)
        });
}

fornitoridao.deleteSupplier = function(id, connection,cb){
	gestionaleLogger.logger.debug('fornitoridao-deleteSupplier');
	  fornitorifactory.deleteSupplier(id, connection,function(err,data){
			return cb(err,data)
        });
}

module.exports = fornitoridao;