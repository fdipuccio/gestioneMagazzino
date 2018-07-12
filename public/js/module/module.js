var gestionaleApp = angular.module('gestionaleApp',
 ['ngRoute', 'ui.bootstrap', 'ngStorage', 'datatables', 'ngMaterial', 'md-steppers', 'ngAnimate','treasure-overlay-spinner', 'moment-picker', 'toggle-switch', 'dynamicNumber', 'naif.base64']); 

//routing
gestionaleApp.config(function($routeProvider, $locationProvider) {
  
$locationProvider.hashPrefix('');
$locationProvider.html5Mode({
    enabled: false,
    requireBase: true
  });    

        $routeProvider
            // route for the home page
            .when('/', {
                templateUrl : 'html/login.html',
                controller  : 'LoginController'                
            })
            .when('/reset', {
                templateUrl : 'html/resetPwd.html',
                controller  : 'LoginController'                
            })
            .when('/home', {
                templateUrl : 'html/home/home.html'                
            })            
            .when('/articoli', {
                templateUrl : 'html/articoli/articoli.html'                
            })
            .when('/categorie', {
                templateUrl : 'html/categorie/categorie.html'                
            })
            // route for the users page
            .when('/users', {
                templateUrl : 'html/users/users.html'               
            })		
            .when('/errore', {
                templateUrl : 'html/errorPage.html'                
            })
            .otherwise({
                     redirectTo: '/'      
            })               
            ;
});

gestionaleApp.config(['dynamicNumberStrategyProvider', function(dynamicNumberStrategyProvider){
  dynamicNumberStrategyProvider.addStrategy('importoPositivo', {
    numInt: 10,
    numFract: 2,
    numSep: ',',
    numPos: true,
    numNeg: false,
    numRound: 'round',
    numThousand: true,
    numFixed:true
    //,numAppend: ' €'
  });
}]);

gestionaleApp.config(['dynamicNumberStrategyProvider', function(dynamicNumberStrategyProvider){
  dynamicNumberStrategyProvider.addStrategy('numeroPositivo', {
    numInt: 10,
    numFract: 0,
    numSep: ',',
    numPos: true,
    numNeg: false,
    numRound: 'round',
    numThousand: true,
    numFixed:true
    //,numAppend: ' €'
  });
}]);



gestionaleApp.run(function($rootScope, $location, $http) {

  $rootScope.handleResponse = function (response){      

      if(response!==undefined && response!==null && response.data != null && response.data.status != null){

            if(response.data.status === "OK"){
                var res = {};
                res.next = true;            
                return res;
            } else if(response.data.status === "KO"){
                var res = {};
                res.next = false;      
                res.errorCode = response.data.code;  
                res.message = response.data.message;    
                return res;
            } else {
               $location.url("/errore"); 
            }

            
      } else {//500??
           $location.url("/errore");             
      }      
  }
    $rootScope.user = undefined;
    $rootScope.userMenu = undefined;

    $http.get('js/resources/labels.properties').then(function (response) {
        	$rootScope.labels = response.data;
            console.log('TestString is ', response.data.TestString);
            console.log('BooleanValue is ', response.data.BooleanValue);            
          });

    $rootScope.spinner = {
        active: false,
        on: function () {
          this.active = true;
          setTimeout( function() {                    
                    if($rootScope.spinner.active){
                        $rootScope.spinner.off();
                    }
            }, 5000);
        },
        off: function () {
          this.active = false;
            setTimeout(function(){
                $rootScope.$apply();
            },10)
        }
      };


  });
