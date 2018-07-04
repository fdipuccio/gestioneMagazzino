angular.module("gestionaleApp").factory('UserService', function($http) {
        return {
            getUserList : function(){            	
            	var tempUrl = '/users';                	
            	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });
            	
            },
            getAdvSearchUsersList : function(filter){              
              var tempUrl = '/users/search';                 
              
               return $http({
                  method: 'POST',
                  url: tempUrl,
                  data : filter          
               });
              
            },
            removeUser : function(p_id){            	
            	var tempUrl = '/users/deleteuser/'+p_id;                	
            	
            	 return $http({
               	  method: 'DELETE',
               	  url: tempUrl        	  
               });
            	
            },
            updateUser : function(editUser){            	
            	var tempUrl = '/users/updateuser/'+editUser.IDUTENTE;                	
                
                var p_body = {};
                
                p_body.username = editUser.USERNAME;
                p_body.password = editUser.PASSWORD;
                p_body.email = editUser.EMAIL;
                p_body.enabled = editUser.ENABLED;
                p_body.force_change_pwd = editUser.FORCE_CHANGE_PWD;
                p_body.idprofilo = editUser.IDPROFILO;

            	 return $http({
               	  method: 'PUT',
                  url: tempUrl,
                  data:p_body        	  
               });
            	
            },
            getUserById : function(p_id){            	
            	var tempUrl = '/users/'+p_id;             	
            	 return $http({
               	  method: 'GET',
               	  url: tempUrl        	  
               });
            	
            },
            createUser : function(newUser){
                var p_body = {};
                
                p_body.username = newUser.username;
                p_body.password = newUser.password;
                p_body.email = newUser.email;
                p_body.enabled = newUser.enabled;
                p_body.force_change_pwd = newUser.force_change_pwd;
                p_body.idprofilo = newUser.idprofilo;

            	var tempUrl = '/users/adduser';                	
            	
            	 return $http({
               	     method: 'POST',
                     url: tempUrl,
                     data:  p_body      	  
               });
            	
            }
        }
    });