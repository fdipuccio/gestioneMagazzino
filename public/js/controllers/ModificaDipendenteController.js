angular.module("gestionaleApp")
.controller("ModificaDipendenteController",
 ['$scope','$uibModalInstance','filterFilter','$sessionStorage','DipendenteService','CommonService',
 function ($scope, $uibModalInstance, filterFilter,$sessionStorage, DipendenteService, CommonService) {
	 'use strict';
		

	//typeahead
	$scope.elencoComuni = [];

	// START PUBLIC FUNCTIONS

	$scope.updateDipendenteButton = function () {
				updateDipendente($uibModalInstance);
			};		
	$scope.cancelEditDipendenteButton = function () {
		//$uibModalInstance.close(false);
		$uibModalInstance.dismiss('cancel');
	};

	//funzione richiamata sull'onchange del campo type ahead dei comuni
	$scope.getComuniWithTypeAhead = function (){
		if($scope.persistent.editDipendente.cittaObject !== null && 
			$scope.persistent.editDipendente.cittaObject !== '' &&
			$scope.persistent.editDipendente.cittaObject.length > 2){
				//TODO sostituire con servizio
			CommonService.getListaComuniAvanzata($scope.persistent.editDipendente.cittaObject).then(function(response) {  		
				if(response!=null && response.data != null){
					$scope.elencoComuni = response.data;	    	
				}    	
			});	
		} else {
				$scope.persistent.editDipendente.citta = "";
				$scope.persistent.editDipendente.cap = "";
				$scope.persistent.editDipendente.provincia = "";
			
		}
	}
	//funzione richiamata quando si seleziona un comune dal typeahead
	$scope.onSelectClient = function ($item, $model, $label) {
		if($item != null){
				$scope.persistent.editDipendente.citta = $item.COMUNE;
				$scope.persistent.editDipendente.cap = $item.CAP;	
				$scope.persistent.editDipendente.provincia = $item.COD_PROVINCIA;

		} else {
				$scope.persistent.editDipendente.citta = "";
				$scope.persistent.editDipendente.cap = "";
				$scope.persistent.editDipendente.provincia = "";
		}
	}

	// END PUBLIC FUNCTIONS

	//init page
	
	//PRIVATE FUNCTIONS

	//funzione di creazione dipendente
	function updateDipendente($uibModalInstance){		
		DipendenteService.updateDipendente($scope.matricolaDipendente,$scope.persistent.editDipendente).then(function(response) {  

			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.$parent.filters.filter.searchkey = $scope.persistent.editDipendente.nome;
				$scope.$parent.getAdvSearchDipendentiList();
				$uibModalInstance.dismiss('cancel');
				toastr.success("Operazione terminata con successo" );

			} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}		

		});
	}
   

}]);

