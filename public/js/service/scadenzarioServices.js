angular.module("gestionaleApp").factory('ScadenzarioService', function($http) {
        return {
            readScadenzario : function(filter){              
              var tempUrl = '/scadenzario';                 
              
               return $http({
                  method: 'POST',
                  url: tempUrl,
                  data : filter          
               });
            	
            }
        }
    });