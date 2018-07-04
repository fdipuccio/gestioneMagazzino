angular.module("gestionaleApp")
.controller("NuovoDipendenteController",
 ['$scope','$uibModalInstance','filterFilter','$sessionStorage','DipendenteService','CommonService','UserService',
 function ($scope, $uibModalInstance, filterFilter,$sessionStorage, DipendenteService, CommonService, UserService) {
	 'use strict';
		
	
		

	$scope.transient = {};
	$scope.transient.newDipendente = {};
	//$scope.transient.newDipendente.conto = {};
	//typeahead
	$scope.elencoComuni = [];

	// START PUBLIC FUNCTIONS

	$scope.createNewDipendenteButton = function () {
				createNewDipendente($uibModalInstance);
			};		
	$scope.cancelNewDipendenteButton = function () {
		//$uibModalInstance.close(false);
		$uibModalInstance.dismiss('cancel');
	};

	//funzione richiamata sull'onchange del campo type ahead dei comuni
	$scope.getComuniWithTypeAhead = function (){
		if($scope.transient.newDipendente.cittaObject !== null && 
			$scope.transient.newDipendente.cittaObject !== '' &&
			$scope.transient.newDipendente.cittaObject.length > 2){
				//TODO sostituire con servizio
			CommonService.getListaComuniAvanzata($scope.transient.newDipendente.cittaObject).then(function(response) {  		
				if(response!=null && response.data != null){
					$scope.elencoComuni = response.data;	    	
				}    	
			});	
		} else {
				$scope.transient.newDipendente.citta = "";
				$scope.transient.newDipendente.cap = "";
				$scope.transient.newDipendente.provincia = "";
			//	$scope.transient.newDipendente.regione = "";
		}
	}
	//funzione richiamata quando si seleziona un comune dal typeahead
	$scope.onSelectDipentente = function ($item, $model, $label) {
		if($item != null){
				$scope.transient.newDipendente.citta = $item.COMUNE;
				$scope.transient.newDipendente.cap = $item.CAP;	
				$scope.transient.newDipendente.provincia = $item.COD_PROVINCIA;
				$scope.transient.newDipendente.regione = $item.COD_REGIONE;	
		} else {
				$scope.transient.newDipendente.citta = "";
				$scope.transient.newDipendente.cap = "";
				$scope.transient.newDipendente.provincia = "";
				$scope.transient.newDipendente.regione = "";
		}
	}

	// END PUBLIC FUNCTIONS

	//init page
	$scope.getUserList();
	
	//PRIVATE FUNCTIONS

	//funzione di creazione dipendente
	function createNewDipendente($uibModalInstance){		
		console.log("createNewDipendente");	
		//TODO gestire meglio		
		DipendenteService.createDipendente($scope.transient.newDipendente).then(function(response) {  

			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){

				console.log("dipendente creato"); 
				$uibModalInstance.dismiss('cancel');
				//a seconda della pagina chiamante, viene invocata la funzione definita sul controller padre
				if($scope.sezioneRichiamante == 'dipendente'){
					//Al caricamento dopo add filtro per il dipendente appena inserito
					$scope.$parent.filters.filter.searchkey = $scope.transient.newDipendente.nome;
					$scope.$parent.getAdvSearchDipendentiList();
				} else if($scope.sezioneRichiamante == 'nuovaFattura'){
					//aggiorna la lista dei dipendenti in pagina
					$scope.getDipendentiList();
					//prevalorizza i dati del nuovo dipendente	
					console.log(response.data.idDipendente.id);				
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

