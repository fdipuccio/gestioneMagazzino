angular.module("gestionaleApp").factory('CommonService', function($http) {
        return {
            getListaComuni : function(){            	
            	var tempUrl = '/comuni';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });            	
            },
            getListaComuniAvanzata : function(searchText){     
                //10 elementi, solo prima pagina       	
            	var tempUrl = '/comuni/pagedSearch/'+searchText+'/10?1';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });            	
            },
            getIvaApplicataList : function(searchText){     
                //10 elementi, solo prima pagina       	
            	var tempUrl = '/ivaApplicata';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });            	
            },
            getPagamentoFattureList : function(searchText){     
                //10 elementi, solo prima pagina       	
            	var tempUrl = '/pagamentofatture?contoPresente='+searchText;                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });            	
            },
            getUDMList : function(searchText){     
                //10 elementi, solo prima pagina       	
            	var tempUrl = '/udm';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });            	
            },
            getValuteList : function(searchText){     
                //10 elementi, solo prima pagina       	
            	var tempUrl = '/valute';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });            	
            }                         
            
        }
    });