angular.module("gestionaleApp").factory('MagazzinoService', function($http) {
        return {
            caricoQuantitaArticolo : function(pLotto){        
                var pbody = {};
                pbody.lotto = pLotto;
            	var tempUrl = '/magazzino/carico';                	
            	
            	 return $http({
               	  method: 'POST',
                  url: tempUrl,
                  data: pbody        	  
               });
            	
            },
            scaricoQuantitaArticolo : function(pLotto){        
                var pbody = {};
                pbody.lotto = pLotto;
            	var tempUrl = '/magazzino/carico';                	
            	
            	 return $http({
               	  method: 'POST',
                  url: tempUrl,
                  data: pbody        	  
               });
            	
            }
        }
    });