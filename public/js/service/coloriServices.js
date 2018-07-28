angular.module("gestionaleApp").factory('ColoriService', function($http) {
        return {
            getColoriList : function(){            	
            	var tempUrl = '/colori';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });
            	
            } ,
            createColore : function(newColore){
                var p_body = {};                
                
                p_body.colore = newColore;



            	var tempUrl = '/colori';                	
            	
            	 return $http({
               	     method: 'POST',
                     url: tempUrl,
                     data:  p_body      	  
               });  
            	
            }, 
            removeColore : function(pId){
                  
            	var tempUrl = '/colori/'+pId;                	
            	
            	 return $http({
               	     method: 'DELETE',
                     url: tempUrl
                       	  
               });  
            	
            },   
            editColore : function(oldCodice, editColore){
                  
            	var tempUrl = '/colori/'+oldCodice;                	
                var p_body = {};     
                p_body.colore = editColore;

            	 return $http({
               	     method: 'PUT',
                     url: tempUrl,
                     data:  p_body 
                       	  
               });  
            	
            },                      
            getColoreById : function(pId){
                  
            	var tempUrl = '/colori/'+pId;                	
            	
            	 return $http({
               	     method: 'GET',
                     url: tempUrl
                       	  
               });  
            	
            }
        }
    });