angular.module("gestionaleApp")
.controller("NotaCreditoController",
 ['$scope','$uibModal','$uibModalInstance','$sessionStorage','filterFilter','$location','$window', '$rootScope', 'FattureService', 'MailService','$filter','DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, $uibModalInstance,$sessionStorage, filterFilter, $location, $window, $rootScope, FattureService, MailService, $filter, DTOptionsBuilder, DTColumnDefBuilder) {
	'use strict';
	
	$scope.fattura = {};
	$scope.fattura.header = {};
	$scope.fattura.righe = [];
	$scope.fattura.scadenza = [];
	$scope.fattura.core = {};
	$scope.listaIvaApplicata = $sessionStorage.listaIvaApplicata;

	//core
	FattureService.getFatturaCoreById($scope.idFattura).then(function(response) {  
		var handleResponseResult = $scope.handleResponse(response);  
		if(handleResponseResult.next){
			$scope.numeroDoc = response.data.fattura.NUMERO +"/"+ response.data.fattura.ANNO_RIF;
			$scope.fattura.core.anno = response.data.fattura.ANNO_RIF;
			$scope.fattura.core.docRif = $scope.idFattura;
			$scope.fattura.core.idCliente = response.data.fattura.ID_CLIENTE;		
			$scope.fattura.core.dataScadenza = $filter('date')(response.data.fattura.DATA_SCADENZA, "dd/MM/yyyy"); 
			$scope.fattura.core.statoFattura=response.data.fattura.DESCRIZIONE_STATO;	
			
			//Valorizzo i campi totale e iva se sono in modifica 
			if($scope.totaleNDCR){
				$scope.fattura.core.totaleNDCR = $scope.totaleNDCR;
				$scope.fattura.core.ivaCode = $scope.ivacode;
			}
		
		} else {
			toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
		}  
	});
	//scadenze
	FattureService.getFatturaScadenzeById($scope.idFattura).then(function(response) {  
		var handleResponseResult = $scope.handleResponse(response);  
		if(handleResponseResult.next){				
			
			angular.forEach(response.data.scadenze, function(item){
				var scadObj = {};
				scadObj.importo = item.IMPORTO;
				scadObj.label = item.LABEL;
				scadObj.scadenza = item.DATA_SCADENZA;				
				scadObj.stato = item.STATO;				
				$scope.fattura.scadenza.push(scadObj);
			});
		} else {
			toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
		}  
	});

	$scope.valorizzaValIva = function(){
		$scope.fattura.core["ivaVal"] = $filter("filter")($scope.listaIvaApplicata, {CODICE: $scope.fattura.core.ivaCode})[0].VALORE;
	};

	$scope.cancelGeneraNdcButton = function () {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.cancelEditNdcButton = function () {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.generaNdc = function(){	
		FattureService.generaNdc($scope.fattura).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
			
				toastr.success("NDC Creata correttamente" );
				console.log("ndc creato correttamente");
				//Vengo da griglia fatture
				if($scope.formElencoFatture){
					$uibModalInstance.dismiss('cancel');		
					$scope.$parent.getFattureWithFilterList("NDCR", "Nota di Credito");
				}else{
					//Vengo da riepilogo/dettaglio fattura
					$rootScope.tipoFatturaCod = "NDCR";
					$rootScope.tipoFatturaDesc = "Nota di Credito";
					$location.url('/fatture');
				}
						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - " + handleResponseResult.message );
			}  	
	    });	
	}

	$scope.editNdc = function(){	
		FattureService.editNdc($scope.fattura, $scope.idNdc).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
			
				toastr.success("NDC Creata correttamente" );
				console.log("ndc creato correttamente");	
				$location.url('/fatture');							
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - " );
			}  	
	    });	
	}

	// END PUBLIC FUNCTIONS

	//init page

}]);

