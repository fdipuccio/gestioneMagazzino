angular.module("gestionaleApp").factory('TimesheetService', function($http) {
        return {
            getTimesheetList : function(p_matricola, p_month){            	
            	var tempUrl = '/timesheet/dipendente/'+p_matricola+'/month/'+p_month;
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });
            	
            },
            getTaskTS : function(){            	
            	var tempUrl = '/timesheet/tasks';
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });
            	
            },
            removeTimesheet : function(p_id){            	
            	var tempUrl = '/dipendenti/'+p_id;
            	
            	 return $http({
               	  method: 'DELETE',
               	  url: tempUrl        	  
               });
            	
            },                  
            createTimesheet : function(carichi, p_matricola, iddata){
                var p_body = {};                
                p_body.carichi = carichi;                
                
            	var tempUrl = '/timesheet/dipendente/'+p_matricola+'/date/'+iddata;                	
            	
            	 return $http({
               	     method: 'POST',
                     url: tempUrl,
                     data:  p_body       	  
               });
            	
            },
            getTimesheetByDay : function(p_matricola, iddata){                        
                
            	var tempUrl = '/timesheet/admin/'+p_matricola+'/date/'+iddata;                 	
            	
            	 return $http({
               	     method: 'GET',
                     url: tempUrl    	  
               });
            	
            },
            updateTimesheet : function(p_matricola, editTimesheet){                        
                  var p_body = {};                
                  p_body.dipendente = editTimesheet; 
            	var tempUrl = '/timesheet/dipendente/'+p_matricola;                	
            	
            	 return $http({
               	     method: 'PUT',
                     url: tempUrl ,
                     data:  p_body     	  
               });
            	
            }
        }
    });