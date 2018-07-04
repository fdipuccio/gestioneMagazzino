angular.module("gestionaleApp").factory('FatturatiService', function($http) {
        return {
            getDataChart : function(filterPeriodo, filterNumElem){            	
            	var tempUrl = '/home/graficovendite?numeroElementi='+filterNumElem+'&granularita='+filterPeriodo;                	
            	/*
              var filter = {};
              
              filter.numeroElementi = filterNumElem;
              filter.granularita = filterPeriodo;
              */
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl
               });
            },
            getScadenzeFM : function(){            	
            	var tempUrl = '/home/totscadenzefinemese';                	

            	 return $http({
               	  method: 'GET',
               	  url: tempUrl
               });
            },
            getFattureEmesse : function(){            	
            	var tempUrl = '/home/totfattureemesse';                	

            	 return $http({
               	  method: 'GET',
               	  url: tempUrl
               });
            }
        }
    });