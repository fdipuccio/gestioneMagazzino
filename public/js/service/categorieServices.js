angular.module("gestionaleApp").factory('CategorieService', function($http) {
        return {
            getCategorieList : function(){            	
            	var tempUrl = '/categoriearticolo';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });
            	
            } ,
            createCategoria : function(newCategoria){
                var p_body = {};                
                
                p_body.categoria = newCategoria;



            	var tempUrl = '/categoriearticolo';                	
            	
            	 return $http({
               	     method: 'POST',
                     url: tempUrl,
                     data:  p_body      	  
               });  
            	
            }, 
            removeCategoria : function(pId){
                  
            	var tempUrl = '/categoriearticolo/'+pId;                	
            	
            	 return $http({
               	     method: 'DELETE',
                     url: tempUrl
                       	  
               });  
            	
            },   
            editCategoria : function(editCategoria){
                  
            	var tempUrl = '/categoriearticolo/'+editCategoria.idCategoria;                	
                var p_body = {};     
                p_body.categoria = editCategoria;

            	 return $http({
               	     method: 'PUT',
                     url: tempUrl,
                     data:  p_body 
                       	  
               });  
            	
            },                      
            getCategoriaById : function(pId){
                  
            	var tempUrl = '/categoriearticolo/'+pId;                	
            	
            	 return $http({
               	     method: 'GET',
                     url: tempUrl
                       	  
               });  
            	
            }
        }
    });