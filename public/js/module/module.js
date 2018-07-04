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
            // route for the azienda page
            .when('/azienda', {
                templateUrl : 'html/azienda/azienda.html'                
            })
            // route for the clienti page
            .when('/clienti', {
                templateUrl : 'html/clienti/clienti.html'                
            })
            .when('/clienti/dettaglioCliente/:idCliente', {
                templateUrl : 'html/clienti/dettaglioCliente.html'                
            })
            // route for the contratti page
            .when('/contrattiManutenzione', {
                templateUrl : 'html/clienti/contrattiClienti.html'                
            })
            .when('/articoli', {
                templateUrl : 'html/articoli/articoli.html'                
            })
            // route for the users page
            .when('/users', {
                templateUrl : 'html/users/users.html'               
            })		
            // route for the fatture page
            .when('/fatture', {
                templateUrl : 'html/fatture/fatture.html'                
            })
            .when('/fatture/inserisciFattura/:tipoFattura', {
                templateUrl : 'html/fatture/newFattura.html'                
            })
            .when('/fatture/dettaglioFattura/:idFattura', {
                templateUrl : 'html/fatture/dettaglioFattura.html'                
            })
            .when('/fatture/modificaFattura/:idFattura', {
                templateUrl : 'html/fatture/modificaFattura.html'                
            })
            // route for the primanota page
            .when('/primanota', {
                templateUrl : 'html/primanota/primanota.html',
                controller  : 'PrimanotaController'
            })
            // route for the scadenzario page
            .when('/scadenzario', {
                templateUrl : 'html/scadenzario/scadenzario.html',
                controller  : 'ScadenzarioController'
            })
            // route for the modalità pagamento e conti page
            .when('/modpagamentoconti', {
                templateUrl : 'html/modpagamentoconti/modpagamentoconti.html',
                controller  : 'ModPagamentoContiController'
            })
            // route for the fornitori page
            .when('/fornitori', {
                templateUrl : 'html/fornitori/fornitori.html'                
            })
            .when('/errore', {
                templateUrl : 'html/errorPage.html'                
            })
             .when('/fatture-acquisto', {
                templateUrl : 'html/fatture-fornitori/fattureFornitori.html'                
            })
            .when('/fatture-acquisto/inserisciFattura/:tipoFattura', {
                templateUrl : 'html/fatture-fornitori/nuovaFatturaFornitore.html'                
            })
            .when('/fatture-acquisto/modificaFattura/:idFattura', {
                templateUrl : 'html/fatture-fornitori/modificaFatturaFornitore.html'                
            })
            .when('/fatture-acquisto/dettaglioFattura/:idFattura', {
                templateUrl : 'html/fatture-fornitori/dettaglioFatturaFornitore.html'                
            })
            .when('/fornitori/dettaglioFornitore/:idFornitore', {
                templateUrl : 'html/fornitori/dettaglioFornitore.html'                
            })
            .when('/dipendenti', {
                templateUrl : 'html/dipendenti/dipendenti.html'                
            })
            .when('/timesheet', {
                templateUrl : 'html/timesheet/timesheet.html',
                controller  : 'TimesheetController'
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
