angular.module("gestionaleApp").factory('PrimanotaService', function($http) {
        return {
            getPrimanotaList : function(){            	
            	var tempUrl = '/primanota';                	
            	
            	 return $http({
               	  method: 'POST',
               	  url: tempUrl        	  
               });
            	
            },
            readAccounts : function(){             
              var tempUrl = '/primanota/readaccount';                 
              
               return $http({
                  method: 'GET',
                  url: tempUrl            
               });
              
            },
            getPrimanotaWithFilterList : function(filter){              
              var tempUrl = '/primanota';                 
              
               return $http({
                  method: 'POST',
                  url: tempUrl,
                  data : filter          
               });
              
            },
            getById : function(p_id){             
              var tempUrl = '/primanota/getById/'+p_id;               
               return $http({
                  method: 'GET',
                  url: tempUrl            
               });
              
            },
            removePrimanota : function(p_id){             
              var tempUrl = '/primanota/deleteprimanota/'+p_id;                 
              
               return $http({
                  method: 'DELETE',
                  url: tempUrl            
               });
              
            },
            createPrimanota : function(newPrimanota){
                var p_body = {};                
                
              var tempUrl = '/primanota/addprimanota';                  
              
               return $http({
                     method: 'POST',
                     url: tempUrl,
                     data:  newPrimanota          
               });
              
            },
            editPrimanota : function(editPrimanota, p_id){
              var p_body = {};
              
                              
              var tempUrl = '/primanota/updateprimanota/'+p_id;      
              
               return $http({
                     method: 'PUT',
                     url: tempUrl,
                     data:  editPrimanota          
               });
              
            },
            exportPrimanota : function(){
              var tempUrl = '/primanota/export';               
              return $http({
                 method: 'GET',
                 url: tempUrl            
              });
            }
        }
    });