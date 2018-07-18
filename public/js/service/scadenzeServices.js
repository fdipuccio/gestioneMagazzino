angular.module("gestionaleApp").factory('ScadenzeService', function($http) {
        return {
            getScadenzeList : function(){            	
            	var tempUrl = '/home/alert/scadenza';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });
            	
            },
            getScadenzeListQty : function(){            	
            	var tempUrl = '/home/alert/quantita';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });
            	
            }
        }
    });