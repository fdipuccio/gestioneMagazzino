angular.module("gestionaleApp").factory('PromemoriaService', function($http) {
        return {
            getPromemoriaList : function(u_id){            	
            	var tempUrl = '/promemoria/'+u_id;                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });
            	
            },
            removePromemoria : function(u_id, n_id){             
              var tempUrl = '/promemoria/'+u_id+'/nota/'+n_id;                 
              
               return $http({
                  method: 'DELETE',
                  url: tempUrl            
               });
              
            },
            createPromemoria : function(newPromemoria, u_id){
                var p_body = {};                
                
              var tempUrl = '/promemoria/'+u_id;                  
              
               return $http({
                     method: 'POST',
                     url: tempUrl,
                     data:  newPromemoria          
               });
              
            },
            editPromemoria : function(editPromemoria, u_id, n_id){
               
              var tempUrl = '/promemoria/'+u_id+'/nota/'+n_id;       
              
               return $http({
                     method: 'PUT',
                     url: tempUrl,
                     data:  editPromemoria          
               });
              
            }
        }
    });