angular.module("gestionaleApp").factory('MagazzinoService', function($http) {
        return {
            caricoQuantitaArticolo : function(pLotto){        
                var pbody = {};
                pbody.lotto = pLotto;
            	var tempUrl = '/magazzini/carico';                	
            	
            	 return $http({
               	  method: 'POST',
                  url: tempUrl,
                  data: pbody        	  
               });
            	
            },
            previewScaricoQuantitaArticolo : function(pScarico){        
                var pbody = {};
                pbody.scarico = pScarico;
            	var tempUrl = '/magazzini/scarico/preview';                	
            	
            	 return $http({
               	  method: 'POST',
                  url: tempUrl,
                  data: pbody        	  
               });
            	
            },

            scaricoQuantitaArticolo : function(pScarico){        
                var pbody = {};
                pbody.scarico = pScarico;
            	var tempUrl = '/magazzini/scarico';                	
            	
            	 return $http({
               	  method: 'POST',
                  url: tempUrl,
                  data: pbody        	  
               });
            	
            }
        }
    });