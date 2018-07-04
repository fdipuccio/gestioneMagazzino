angular.module("gestionaleApp").factory('LoginService', function($http) {
        return {
            checkLogin : function(username,password){
              
              var tempUrl = '/login/checklogin';                  
              
               return $http({
                  method: 'POST',
                  url: tempUrl,
                  data : {
                    username:username,
                    password:password
                  }           
               });
              
            },

             logout : function(){
              
              var tempUrl = '/login/logout';                  
              
               return $http({
                  method: 'GET',
                  url: tempUrl
               });
              
            },

             resetPassword : function(username,oldpassword,newpassword){
              var tempUrl = '/login/resetPassword';                  
              
               return $http({
                  method: 'POST',
                  url: tempUrl,
                  data : {
                    username:username,
                    oldpassword:oldpassword,
                    newpassword:newpassword
                  }           
               });
              
            }

        }


    });