var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var index = require('./routes/index');
var users = require('./routes/users');
var home = require('./routes/home');
var login = require('./login/login');
var clienti = require('./routes/clienti');
var fornitori = require('./routes/fornitori');
var comuni = require('./routes/comuni');
var magazzini = require('./routes/magazzino');
var articoli = require('./routes/articoli');
var udm = require('./routes/udm');
var ivaApplicata = require('./routes/ivaApplicata');
var valute = require('./routes/valute');
var gestionaleLogger = require("./utility/gestionaleLogger");
var mail = require("./routes/mail");
var xls = require('./routes/xls');

var aspect=require('./security/accesscontrol.js');
var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(session({secret: 'safety'}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Routing va sempre dopo la connessione
app.use('/', index);
app.use('/users', users);
app.use('/home', home);
app.use('/login', login);
app.use('/clienti', clienti);
app.use('/fornitori', fornitori);
app.use('/comuni', comuni);
app.use('/magazzini',magazzini);
app.use('/articoli', articoli);
app.use('/udm', udm);
app.use('/ivaApplicata', ivaApplicata);
app.use('/valute', valute);
app.use('/mail', mail);

//Template
app.use('/xls', xls);



// HTTPS section BEGIN
/**
 * lanciare i seguenti comandi nella cartella certs:
 * 1) openssl genrsa -out ca.key 4096 
 *      nel caso si ricevesse un errore simile a:
 *          Unable to load config info from C:/OpenSSL/openssl.cnf
 *      va settata la variabile: set OPENSSL_CONF=<pathName completo del file openssl.cnf>
 *
 * 2) openssl req -new -x509 -days 1826 -key ca.key -out ca.crt
 *      L'opzione -x509 viene utilizzata per un certificato autofirmato. 1826 giorni ci danno un certificato valido per 5 anni.
 * 
 * 3) openssl genrsa -out ia.key 4096
 * 
 * 4) openssl req -new -key ia.key -out ia.csr
 *      Assicurarsi che il Common Name immesso qui sia diverso dal Common Name immesso in precedenza per la CA principale. 
 *      Se sono uguali, si verificherà un errore più avanti durante la creazione del file pkcs12
 * 
 * 5) openssl x509 -req -days 730 -in ia.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out ia.crt
 *      Il certificato sarà valido per 2 anni (730 giorni) e ho deciso di scegliere il mio numero di serie 01 per questo certificato 
 *      (-set_serial 01). Per la root CA, ho lasciato che OpenSSL generi un numero seriale casuale.
 */

/*var fs = require('fs');
var https = require('https');

var key = fs.readFileSync('certs/ia.key');
var cert = fs.readFileSync( 'certs/ia.crt' );
var ca = fs.readFileSync( 'certs/ca.crt' );

var options = {
    key: key,
    cert: cert,
    ca: ca
  };

var listener = https.createServer(options, app).listen(443, function () {
    console.log('Express HTTPS server listening on port ' + listener.address().port);
});
*/
// HTTPS section END


var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Gestionale app listening at http://%s:%s", host, port)
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var retObj={};
    retObj.status='KO';
    retObj.errorCode="404"
    retObj.message="Resource not Found"
    res.end(JSON.stringify(retObj));
});

// error handler
app.use(function(err, req, res, next) {
    // render the error page
    res.status(err.status || 500);
    var retObj={};
    retObj.errorCode="500"
    retObj.status='KO';
    retObj.message=err.message;
    res.end(JSON.stringify(retObj));
});


/*process.on('uncaughtException', function (req, res, route, err) {
    var result={"result":"KO","errMessage":err};
    gestionaleLogger.logger.info('Errore: ' + err);
    //res.end(JSON.stringify(result));
});*/

  
module.exports = app;
