angular.module("gestionaleApp").factory('StringUtility', function($http) {
        return {
            test : function(par){            	
            	return par;           	
            },

            getLastTenYearInArray: function(){

                var year = new Date().getFullYear();
                var years = [];
                for(var i = 0; i < 10; i++) {
                    years.push({ID: '' +year - i});
                }    
                return years;
            },
            getCurrentYear: function(){
                var year = new Date().getFullYear();                
                return ''+year;
            }

            
        }  
    });