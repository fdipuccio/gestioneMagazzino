angular.module("gestionaleApp").controller("ModPagamentoContiController", function($scope, ModPagamentoContiService, ClienteService, $filter) {
	$scope.model ={};	
	$scope.accountsList = [];
	$scope.accountsList = [{ID_CONTO:-1, DESCRIZIONE: 'tutti i conti', TOT: 2570.00, CONT:1}, {ID_CONTO:1000, DESCRIZIONE: 'conto di test1', TOT: 1500.00, CONT:2}, {ID_CONTO:1001, DESCRIZIONE: 'conto di test2', TOT: 920.00, CONT:3}, {ID_CONTO:1002, DESCRIZIONE: 'conto di test3', TOT: 150.00, CONT:4}];
	$scope.modpagamentoList = [];
	$scope.modpagamentoList = [{DESCRIZIONE: 'Bonifico', ISDEFAULT: true}, {DESCRIZIONE: 'PayPal', ISDEFAULT: false}];

	$scope.transient = {};
	$scope.transient.newConto = {};
	$scope.transient.newModPag = {};

	//funzione che recupera la lista dei conti
	$scope.readAccounts = function (){
		//invocazione service
		ModPagamentoContiService.readAccounts().then(function(response) {  
	    	if(response!=null && response.data != null){
	    		$scope.accountsList = response.data;	    		
	    	}    	
	    });		
	}
       
    //funzione che recupera la lista dei conti
	$scope.readModPagamento = function (){
		//invocazione service
		ModPagamentoContiService.readModPagamento().then(function(response) {  
	    	if(response!=null && response.data != null){
	    		$scope.modpagamentoList = response.data;	    		
	    	}    	
	    });		
	}

	$scope.createConto = function (){
		console.log("createConto");
		ModPagamentoContiService.createConto($scope.transient.newConto).then(function(response) {  
	    	if(response!=null && response.data != null && response.data =='OK'){
				console.log("Conto creato");
				$scope.readAccounts(); 		
	    	} else {
				console.error("errore creazione Conto");				
			}    	
		});
	}

	$scope.createModPag = function (){
		console.log("createModPag");
		//adding default values at moment
		$scope.transient.newModPag.isDefault = false;
		ModPagamentoContiService.createModPag($scope.transient.newModPag).then(function(response) {  
	    	if(response!=null && response.data != null && response.data =='OK'){
				console.log("ModPag creato"); 
				$scope.readModPagamento(); 		
	    	} else {
				console.error("errore creazione ModPag");				
			}    	
		});
	}

//$scope.readAccounts();
//$scope.readModPagamento();
    
}); 

