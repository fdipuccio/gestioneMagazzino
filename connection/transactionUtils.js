var gestionaleLogger = require("../utility/gestionaleLogger");

/**
 * Convenience wrapper for database connection in a transaction
 */
exports.inTransaction=function (pool, body, callback) {
    withConnection(pool, function(db, done) {

        db.beginTransaction(function(err) {
            if (err) return done(err);
            body(db, finished)
        })

        // Commit or rollback transaction, then proxy callback
        function finished(err) {
            var context = this;
            let args = arguments;

            if (err) {
                if (err == 'rollback') {
                    args[0] = err = null;
                }
                gestionaleLogger.logger.error('rollback : '+db.threadId);
                    db.rollback(function() { 
                    done.apply(this, args) });
            } else {
                gestionaleLogger.logger.error('commit : '+db.threadId);
                db.commit(function(err) {
                    args[0] = err;
                    done.apply(this, args)
                })
            }
        }
    }, callback)
}

exports.getConnection=function (pool, body, callback) {
    pool.getConnection(function(err, db) {
        try{
            gestionaleLogger.logger.error('get : '+db.threadId);
            body(db)
        }catch(err){
            gestionaleLogger.logger.info('Error Transaction Util :',err);
        }finally{
            db.release();
                 }

    })
  
}

/**
 * Convenience wrapper for database connection from pool
 */


function withConnection(pool, body, callback) {
    pool.getConnection(function(err, db) {
        if (err) return callback(err);

            body(db, finished);

        function finished() {
            if(( db._pool._freeConnections.indexOf(db) == -1)){       
                db.release();
            }
            gestionaleLogger.logger.info('RELEASED CONNECTION');
           callback.apply(this, arguments);
        }
    })
}

