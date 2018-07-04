angular.module("gestionaleApp")
.controller("ModificaClienteController",
 ['$scope','$uibModalInstance','filterFilter','$sessionStorage','ClienteService','CommonService',
 function ($scope, $uibModalInstance, filterFilter,$sessionStorage, ClienteService, CommonService) {
	 'use strict';
		
	$scope.listaIvaApplicata = $sessionStorage.listaIvaApplicata;	
		

	//typeahead
	$scope.elencoComuni = [];

	// START PUBLIC FUNCTIONS

	$scope.updateClienteButton = function () {
				updateCliente($uibModalInstance);
			};		
	$scope.cancelEditClienteButton = function () {
		//$uibModalInstance.close(false);
		$uibModalInstance.dismiss('cancel');
	};

	//funzione richiamata sull'onchange del campo type ahead dei comuni
	$scope.getComuniWithTypeAhead = function (){
		if($scope.transient.editCliente.cittaObject !== null && 
			$scope.transient.editCliente.cittaObject !== '' &&
			$scope.transient.editCliente.cittaObject.length > 2){
				//TODO sostituire con servizio
			CommonService.getListaComuniAvanzata($scope.transient.editCliente.cittaObject).then(function(response) {  		
				if(response!=null && response.data != null){
					$scope.elencoComuni = response.data;	    	
				}    	
			});	
		} else {
				$scope.transient.editCliente.citta = "";
				$scope.transient.editCliente.cap = "";
				$scope.transient.editCliente.provincia = "";
			
		}
	}
	//funzione richiamata quando si seleziona un comune dal typeahead
	$scope.onSelectClient = function ($item, $model, $label) {
		if($item != null){
				$scope.transient.editCliente.citta = $item.COMUNE;
				$scope.transient.editCliente.cap = $item.CAP;	
				$scope.transient.editCliente.provincia = $item.COD_PROVINCIA;

		} else {
				$scope.transient.editCliente.citta = "";
				$scope.transient.editCliente.cap = "";
				$scope.transient.editCliente.provincia = "";
		}
	}

	// END PUBLIC FUNCTIONS

	//init page
	
	
	//PRIVATE FUNCTIONS

	//funzione di creazione cliente
	function updateCliente($uibModalInstance){		
		ClienteService.updateCliente($scope.idClienteSelezionato,$scope.transient.editCliente).then(function(response) {  

			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.getClientiList(); 
				$uibModalInstance.dismiss('cancel');
				toastr.success("Operazione terminata con successo" );

			} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}		

		});
	}
   

}]);

