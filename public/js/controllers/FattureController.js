angular.module("gestionaleApp")
.controller("FattureController",
 ['$scope','$uibModal','filterFilter','$location','$window','$rootScope', 'FattureService', '$filter', 'DTOptionsBuilder', 'DTColumnDefBuilder','$sessionStorage',
 function ($scope, $uibModal, filterFilter, $location, $window,$rootScope, FattureService, $filter, DTOptionsBuilder, DTColumnDefBuilder,$sessionStorage) {
	'use strict';
	
	$scope.fatture = [];
	$scope.listaIvaApplicata = $sessionStorage.listaIvaApplicata;
	$scope.tipoFattureList = $sessionStorage.tipoFattureList;

	$scope.temp = {};
	$scope.abilitaPagamentoMassivo = false;

	$scope.filters = {};
	$scope.filters.filter = {competenza: true, nopagato:false, scaduto: false, preferito:false};

	//tabella elenco fatture
	$scope.dtOptions = DTOptionsBuilder.newOptions()
	.withOption('responsive', true)
	.withOption('order', [2, 'desc'])
	.withLanguageSource('//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json');

	$scope.dtColumnDefs = [      
		DTColumnDefBuilder.newColumnDef(0).notSortable().withOption('width', '5%'),
		DTColumnDefBuilder.newColumnDef(1).withOption('width', '40%'),
		DTColumnDefBuilder.newColumnDef(2).withOption('type', 'custom_sort_numero').withOption('width', '8%'),
		DTColumnDefBuilder.newColumnDef(3).withOption('width', '15%'),
		DTColumnDefBuilder.newColumnDef(4).withOption('width', '10%'),
		DTColumnDefBuilder.newColumnDef(5).withOption('type', 'custom_sort_currency').withOption('width', '12%'), 
		DTColumnDefBuilder.newColumnDef(6).notSortable().withOption('width', '10%')
		  

	];
	
	// START PUBLIC FUNCTIONS

	//funzione che recupera la lista di tutti gli utenti
	$scope.getFattureList = function (){		
		//invocazione service
		$scope.abilitaPagamentoMassivo = false;
		$scope.spinner.on();		
		FattureService.getFattureList().then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.fatture = response.data.fatture;	 						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode );
			}  
			$scope.spinner.off();	
	    });	
	}
	
	//funzione che recupera la lista di tutti gli utenti
	$scope.getFattureWithFilterList = function (tipoFattura, descFattura){	

		//Controllo se vengo da una nuova fattura
		if($rootScope.tipoFatturaCod){
			tipoFattura = $rootScope.tipoFatturaCod;
			descFattura = $rootScope.tipoFatturaDesc;
			delete $rootScope.tipoFatturaCod;
			delete $rootScope.tipoFatturaDesc;
		}

		if(tipoFattura){
			$scope.filters.filter.tipoFattura = tipoFattura;
			$scope.descTipoFattura = descFattura;

			//Disabilito il filtro Pagato/NoPagato e Scaduto se il documento è un DDT o un NDCR o una PROF
			$scope.filters.filter.nopagato = tipoFattura==='DDT' || tipoFattura==='NDCR' || tipoFattura==='PROF'?false:$scope.filters.filter.nopagato;
			$scope.filters.filter.scaduto = tipoFattura==='DDT' || tipoFattura==='NDCR' || tipoFattura==='PROF'?false:$scope.filters.filter.scaduto;
			$scope.filters.filter.stato = $scope.filters.filter.nopagato==true?"NPAG":"PAG";

		}else{
			$scope.filters.filter.tipoFattura = 'IMME';
			$scope.codeTipoFattura = 'IMME';
			$scope.descTipoFattura = 'Fattura Immediata';
			$scope.filters.filter.stato = $scope.filters.filter.nopagato==true?"NPAG":"PAG";
			$scope.abilitaPagamentoMassivo = false;

		}

		jQuery.each( $scope.tipoFattureList, function( i, typeFatt ) {
			
			if(typeFatt.ID === $scope.filters.filter.tipoFattura){
				typeFatt["activeButton"] = 'active';
			}else{
				typeFatt["activeButton"] = '';
			}

		});


		//invocazione service
		
		$scope.spinner.on();		
		FattureService.getFattureWithFilterList($scope.filters).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.fatture = response.data.fatture;	 						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode );
				$scope.spinner.off();
			}  
			$scope.spinner.off();	
	    });	
	}

	$scope.gotoNuovaFattura = function(tipoFattura){
		$location.url('fatture/inserisciFattura/'+tipoFattura);
	}
	
	$scope.creaPdfFattura = function(p_id,tipoFattura){	
		$scope.spinner.on();
		FattureService.creaPdfFattura(p_id).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				console.log("pdf creato correttamente");
				var urlTemp = $location.protocol()+":\/\/"+$location.host()+":"+$location.port();
				$window.open(urlTemp+"/pdf/show/"+tipoFattura+"/"+response.data.nomeFile);					
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );					
			}  
			$scope.spinner.off();	
	    });	
	}
	//Gestione Preferiti su fattura
	$scope.setPreferita = function(p_id, flagPreferita, numeroFattura){	
		$scope.spinner.on();
		FattureService.setPreferita(p_id, flagPreferita).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
	    		var mess = flagPreferita?"":"non";
				toastr.success("Documento " + numeroFattura +" impostato come "+mess+" preferito" );
				$scope.getFattureWithFilterList($scope.filters.filter.tipoFattura, $scope.descTipoFattura);
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
				$scope.spinner.off();				
			}  
			$scope.spinner.off();	
	    });	
	}

	$scope.dettaglioModificaFattura = function(p_id, p_stato){
		
		if(p_stato.toUpperCase() === 'NON PAGATO'){
			$location.url("/fatture/modificaFattura/"+p_id);
		} else if(p_stato.toUpperCase() === 'PAGATO' || p_stato.toUpperCase() === 'PAGAMENTO PARZIALE' ){//TODO
			$location.url("/fatture/dettaglioFattura/"+p_id);
		} else {
			//..
		}
	}	

	//open modale pagamento fattura
	$scope.openModalPagamentoFatture = function (pIdFattura) {		
		$scope.idFattura = pIdFattura;
		$uibModal.open({
		templateUrl: './html/fatture/modalPagamentoFatture.html',
		scope:$scope,	
		backdrop:'static',
		size: 'lg',	
		controller: 'PagamentoFattureController'
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
 	 };

	  //open modale di inserimento utente
	$scope.openModalPagamentoFattureMassivo = function () {		
		
		$uibModal.open({
		templateUrl: './html/fatture/modalPagamentoFattureMassivo.html',
		scope:$scope,	
		backdrop:'static',		
		controller: 'PagamentoMassivoFattureController'
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
 	 };


	$scope.abilitaDisabilitaPagamentoMassimo = function (){
		$scope.abilitaPagamentoMassivo = false;
		angular.forEach($scope.fatture, function(item){
			if(item.checked){
				$scope.abilitaPagamentoMassivo = true;
				
			}
		});

	}

	$scope.askConfirmationDelete = function(p_id) {
		var message = "Sei sicuro di voler eliminare il DDT selezionato?";
		var modalHtml = '<div class="modal-body">' + message + '</div>';
		modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="confirmDeleteFattura()">OK</button><button class="btn btn-warning" ng-click="cancelDelete()">Cancel</button></div>';

		$uibModal.open({
			template: modalHtml,
			scope:$scope,
			backdrop:'static',		
			controller: function ($scope, $uibModalInstance) {
				$scope.confirmDeleteFattura = function () {
					$scope.removeFattura(p_id);
					$uibModalInstance.dismiss('cancel');
				};		
				$scope.cancelDelete = function () {
					//$uibModalInstance.close(false);
					$uibModalInstance.dismiss('cancel');
				};
			}
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});    
	};

	$scope.removeFattura = function (p_id){
		console.log("removeFattura = " + p_id);
		FattureService.removeDDT(p_id).then(function(response) {  

			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				toastr.success("DDT cancellato correttamente"); 
				$scope.getFattureWithFilterList($scope.filters.filter.tipoFattura, $scope.descTipoFattura);									
	    	} else {
				var message = "errore_fattura_codice_"+handleResponseResult.errorCode;
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - " + $scope.labels[message]);
			}
	    	   	
	    });				
	}

	$scope.generaDdt = function(p_id){	
		
		FattureService.generaDdt(p_id).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
			if(handleResponseResult.next){
				toastr.success("DDT Creato correttamente" );
				console.log("ddt creato correttamente");
				$location.url('fatture/modificaFattura/'+response.data.fattura.OUTCOME);								
			} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - " );
			}  	
		});	
	}

	$scope.openModalGeneraNDCR = function (pIdFattura) {		
		$scope.idFattura = pIdFattura;
		$scope.formElencoFatture = true;
		$uibModal.open({
		templateUrl: './html/fatture/modalGeneraNdc.html',
		scope:$scope,	
		backdrop:'static',		
		controller: 'NotaCreditoController'
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
	  };
	  
	  $scope.editModalGeneraNDC = function (pIdNdc) {
		FattureService.getNDCById(pIdNdc).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
			if(handleResponseResult.next){
				//recupero i dati dell'NDCR e li setto nello scope
				$scope.fattura = {};
				$scope.fattura.core = {};
				$scope.idFattura = response.data.ndcr.docrif;
				$scope.ivaCode = response.data.ndcr.ivacode;
				$scope.totaleNDCR = response.data.ndcr.totalendcr;
				$scope.idNdc = pIdNdc;

				$uibModal.open({
					templateUrl: './html/fatture/editModalGeneraNdc.html',
					scope:$scope,	
					backdrop:'static',		
					controller: 'NotaCreditoController'
					}).result.catch(function(res) {
						if (!(res === 'cancel' || res === 'escape key press')) {
							throw res;
						}
					});

			} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}  
		});
 	 };

	// END PUBLIC FUNCTIONS

	//init page

	$scope.getFattureWithFilterList();

	$.fn.dataTableExt.oSort['custom_sort_numero-asc'] = function(a,b) {

        var aValues = a.split('/');		
		var aNumero = parseInt(aValues[0]);
		var aAnno = parseInt(aValues[1]);

		var bValues = b.split('/');
		var bNumero = parseInt(bValues[0]);
		var bAnno = parseInt(bValues[1]);
		

		if(aAnno != bAnno){
			return aAnno - bAnno;
		} else {
			return aNumero - bNumero;
		}

    }

    $.fn.dataTableExt.oSort['custom_sort_numero-desc'] = function(a,b) {
    	var aValues = a.split('/');		
		var aNumero = parseInt(aValues[0]);
		var aAnno = parseInt(aValues[1]);

		var bValues = b.split('/');
		var bNumero = parseInt(bValues[0]);
		var bAnno = parseInt(bValues[1]);

		if(aAnno != bAnno){
			return bAnno - aAnno;
		} else {
			return bNumero - aNumero;
		}
	}

	$.fn.dataTableExt.oSort['custom_sort_currency-asc'] = function(a,b) {

        var aValues = a.split(' ');		
		var aNumero = parseInt(aValues[0]);
		var aAnno = parseInt(aValues[1]);

		var bValues = b.split(' ');
		var bNumero = parseInt(bValues[0]);
		var bAnno = parseInt(bValues[1]);
			
		return aNumero - bNumero;
    }

    $.fn.dataTableExt.oSort['custom_sort_currency-desc'] = function(a,b) {
    	var aValues = a.split(' ');		
		var aNumero = parseInt(aValues[0]);
		var aAnno = parseInt(aValues[1]);

		var bValues = b.split(' ');
		var bNumero = parseInt(bValues[0]);
		var bAnno = parseInt(bValues[1]);
			
		return bNumero - aNumero;
	}

}]);

