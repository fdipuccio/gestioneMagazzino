var gestionaleLogger = require('./gestionaleLogger');
var fs = require('fs');


gestionaleLogger.logger = require('tracer').console({
    level:'debug',    
	transport: [
        function (data) {
			fs.appendFile('./GestionaleMagazzino.log', data.output + '\n', (err) => {
				if (err) throw err;
			});
		},
		function(data) {
			console.log(data.output);
		}
	]
});

module.exports = gestionaleLogger;