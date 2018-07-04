angular.module("gestionaleApp")
.controller("NuovoClienteController",
 ['$scope','$uibModalInstance','filterFilter','$sessionStorage','ClienteService','CommonService',
 function ($scope, $uibModalInstance, filterFilter,$sessionStorage, ClienteService, CommonService) {
	 'use strict';
		
	$scope.listaIvaApplicata = $sessionStorage.listaIvaApplicata;	
		

	$scope.transient = {};
	$scope.transient.newCliente = {};
	//$scope.transient.newCliente.conto = {};
	//typeahead
	$scope.elencoComuni = [];

	// START PUBLIC FUNCTIONS

	$scope.createNewClienteButton = function () {
				createNewCliente($uibModalInstance);
			};		
	$scope.cancelNewClienteButton = function () {
		//$uibModalInstance.close(false);
		$uibModalInstance.dismiss('cancel');
	};

	//funzione richiamata sull'onchange del campo type ahead dei comuni
	$scope.getComuniWithTypeAhead = function (){
		if($scope.transient.newCliente.cittaObject !== null && 
			$scope.transient.newCliente.cittaObject !== '' &&
			$scope.transient.newCliente.cittaObject.length > 2){
				//TODO sostituire con servizio
			CommonService.getListaComuniAvanzata($scope.transient.newCliente.cittaObject).then(function(response) {  		
				if(response!=null && response.data != null){
					$scope.elencoComuni = response.data;	    	
				}    	
			});	
		} else {
				$scope.transient.newCliente.citta = "";
				$scope.transient.newCliente.cap = "";
				$scope.transient.newCliente.provincia = "";
			//	$scope.transient.newCliente.regione = "";
		}
	}
	//funzione richiamata quando si seleziona un comune dal typeahead
	$scope.onSelectClient = function ($item, $model, $label) {
		if($item != null){
				$scope.transient.newCliente.citta = $item.COMUNE;
				$scope.transient.newCliente.cap = $item.CAP;	
				$scope.transient.newCliente.provincia = $item.COD_PROVINCIA;
				$scope.transient.newCliente.regione = $item.COD_REGIONE;	
		} else {
				$scope.transient.newCliente.citta = "";
				$scope.transient.newCliente.cap = "";
				$scope.transient.newCliente.provincia = "";
				$scope.transient.newCliente.regione = "";
		}
	}

	// END PUBLIC FUNCTIONS

	//init page
	
	
	//PRIVATE FUNCTIONS

	//funzione di creazione cliente
	function createNewCliente($uibModalInstance){		
		console.log("createNewCliente");	
		//TODO gestire meglio		
		ClienteService.createCliente($scope.transient.newCliente).then(function(response) {  

			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){

				console.log("cliente creato"); 
				$uibModalInstance.dismiss('cancel');
				//a seconda della pagina chiamante, viene invocata la funzione definita sul controller padre
				if($scope.sezioneRichiamante == 'cliente'){
					//Al caricamento dopo add filtro per il cliente appena inserito
					$scope.$parent.filters.filter.searchkey = $scope.transient.newCliente.nome;
					$scope.$parent.getAdvSearchClientiList();
				} else if($scope.sezioneRichiamante == 'nuovaFattura'){
					//aggiorna la lista dei clienti in pagina
					$scope.getCustomersList();
					//prevalorizza i dati del nuovo cliente	
					console.log(response.data.idCliente.id);				
					$scope.onSelectClientPostCreazione(response.data.idCliente.id);
				} else {
					//TODO altre sezioni
				}

			}  else {
				if(handleResponseResult.errorCode == 'CLI001'){
					toastr.warning(handleResponseResult.message);
				} else {
					toastr.error("ERRORE CREAZIONE CLIENTE");		
				}
						
			}    	

	    	if(response!=null && response.statusText == "OK" && response.data !== null){
				
					
	    	} else {
							
			}    	
		});
	}
	
}]);

