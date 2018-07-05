angular.module("gestionaleApp").factory('CommonService', function($http) {
        return {
            getListaDiametro : function(){ 
              

                           	
            	var tempUrl = '/diametro';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });   
                        	
            }                             
            
        }
    });