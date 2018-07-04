angular.module("gestionaleApp").factory('ModPagamentoContiService', function($http) {
        return {
            readAccounts : function(){
            	
            var tempUrl = '/modpagamentoconti/readaccount';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });
            	
            },
            readModPagamento : function(){
              
            var tempUrl = '/modpagamentoconti/readmodpagamento';                  
              
               return $http({
                  method: 'GET',
                  url: tempUrl            
               });
              
            },
            createConto : function(newConto){
                var p_body = {};                
                
              var tempUrl = '/modpagamentoconti/addConto';                  
              
               return $http({
                     method: 'POST',
                     url: tempUrl,
                     data:  newConto          
               });
              
            },
            createModPag : function(newModPag){
                var p_body = {};                
                
              var tempUrl = '/modpagamentoconti/addModPagamento';                  
              
               return $http({
                     method: 'POST',
                     url: tempUrl,
                     data:  newModPag          
               });
              
            }
        }
    });