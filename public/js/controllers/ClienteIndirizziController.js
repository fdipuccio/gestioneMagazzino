angular.module("gestionaleApp")
.controller("ClienteIndirizziController",
 ['$scope','$uibModal','$uibModalInstance','filterFilter','$sessionStorage','ClienteService','CommonService','DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, $uibModalInstance, filterFilter,$sessionStorage, ClienteService, CommonService, DTOptionsBuilder, DTColumnDefBuilder) {
	 'use strict';
		
	$scope.transient = {};	
	$scope.transient.nuovoIndirizzo = {};
	
	$scope.indirizzi = [];

	//typeahead
	$scope.elencoComuni = [];

	// START PUBLIC FUNCTIONS
		
	$scope.cancelNuovoIndirizzoButton = function () {
		//$uibModalInstance.close(false);
		$uibModalInstance.dismiss('cancel');
	};

	$scope.cancelModificaIndirizzoButton = function () {
		//$uibModalInstance.close(false);
		$uibModalInstance.dismiss('cancel');
	};

	//funzione richiamata sull'onchange del campo type ahead dei comuni
	$scope.getComuniWithTypeAhead = function (){
		if($scope.transient.nuovoIndirizzo.cittaObject !== null && 
			$scope.transient.nuovoIndirizzo.cittaObject !== '' &&
			$scope.transient.nuovoIndirizzo.cittaObject.length > 2){
				//TODO sostituire con servizio
			CommonService.getListaComuniAvanzata($scope.transient.nuovoIndirizzo.cittaObject).then(function(response) {  		
				if(response!=null && response.data != null){
					$scope.elencoComuni = response.data;	    	
				}    	
			});	
		} else {
				$scope.transient.nuovoIndirizzo.citta = "";
				$scope.transient.nuovoIndirizzo.cap = "";
				$scope.transient.nuovoIndirizzo.provincia = "";
			//	$scope.transient.nuovoIndirizzo.regione = "";
		}
	}
	//funzione richiamata quando si seleziona un comune dal typeahead
	$scope.onSelectClient = function ($item, $model, $label) {
		if($item != null){
				$scope.transient.nuovoIndirizzo.citta = $item.COMUNE;
				$scope.transient.nuovoIndirizzo.cap = $item.CAP;	
				$scope.transient.nuovoIndirizzo.provincia = $item.COD_PROVINCIA;
				$scope.transient.nuovoIndirizzo.regione = $item.COD_REGIONE;	
		} else {
				$scope.transient.nuovoIndirizzo.citta = "";
				$scope.transient.nuovoIndirizzo.cap = "";
				$scope.transient.nuovoIndirizzo.provincia = "";
				$scope.transient.nuovoIndirizzo.regione = "";
		}
	}
	
	//funzione richiamata sull'onchange del campo type ahead dei comuni
	$scope.getComuniWithTypeAhead_1 = function (){
		if($scope.persistent.modificaIndirizzo.cittaObject !== null && 
			$scope.persistent.modificaIndirizzo.cittaObject !== '' &&
			$scope.persistent.modificaIndirizzo.cittaObject.length > 2){
				//TODO sostituire con servizio
			CommonService.getListaComuniAvanzata($scope.persistent.modificaIndirizzo.cittaObject).then(function(response) {  		
				if(response!=null && response.data != null){
					$scope.elencoComuni = response.data;	    	
				}    	
			});	
		} else {
				$scope.persistent.modificaIndirizzo.citta = "";
				$scope.persistent.modificaIndirizzo.cap = "";
				$scope.persistent.modificaIndirizzo.provincia = "";
			//	$scope.persistent.modificaIndirizzo.regione = "";
		}
	}
	//funzione richiamata quando si seleziona un comune dal typeahead
	$scope.onSelectClient_1 = function ($item, $model, $label) {
		if($item != null){
				$scope.persistent.modificaIndirizzo.citta = $item.COMUNE;
				$scope.persistent.modificaIndirizzo.cap = $item.CAP;	
				$scope.persistent.modificaIndirizzo.provincia = $item.COD_PROVINCIA;
				$scope.persistent.modificaIndirizzo.regione = $item.COD_REGIONE;	
		} else {
				$scope.persistent.modificaIndirizzo.citta = "";
				$scope.persistent.modificaIndirizzo.cap = "";
				$scope.persistent.modificaIndirizzo.provincia = "";
				$scope.persistent.modificaIndirizzo.regione = "";
		}
	}

	$scope.createNuovoIndirizzoButton = function(){
		var vm = this;		
		ClienteService.salvaIndirizzoCliente($scope.idClienteSelezionato,$scope.transient.nuovoIndirizzo).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				toastr.success("Indirizzo creato con successo");
				vm.nuovoIndirizzoForm.$setPristine();
				$scope.$parent.getElencoIndirizzi();
				$scope.transient.nuovoIndirizzo = {};
				$('.nav-tabs a[href="#tab_1_55"]').trigger('click');
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}    	
		});
	}

	$scope.createModificaIndirizzoButton = function(){
		var vm = this;		
		ClienteService.modificaIndirizzoCliente($scope.idClienteSelezionato,$scope.persistent.modificaIndirizzo, $scope.idIndirizzo).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				toastr.success("Indirizzo modificato con successo");
				vm.modificaIndirizzoForm.$setPristine();
				$scope.$parent.getElencoIndirizzi();
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}    	
		});
	}
	
	
	$scope.confirmDeleteIndirizzoCliente = function () {
		$scope.removeIndirizzoCliente($scope.idClienteSelezionato, $scope.idIndirizzo);
		$uibModalInstance.dismiss('cancel');
	};		
	$scope.cancelDeleteIndirizzo = function () {
		//$uibModalInstance.close(false);
		$uibModalInstance.dismiss('cancel');
	};


	$scope.removeIndirizzoCliente = function (p_idCliente, p_idIndirizzo){
		console.log("remove Indirizzo Cliente = " + p_idIndirizzo);
		ClienteService.deleteIndirizzoCliente(p_idCliente, p_idIndirizzo).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				toastr.success("Indirizzo eliminato con successo");
				$scope.$parent.getElencoIndirizzi();	
				$scope.transient.nuovoIndirizzo = {};
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}     	
	    });				
	}

	// END PUBLIC FUNCTIONS

	//init page
	
}]);

