angular.module("gestionaleApp")
.controller("FattureFornitoriController",
 ['$scope','$uibModal','filterFilter','$location','$window', 'FattureService','FattureFornitoriService', '$filter', 'DTOptionsBuilder', 'DTColumnDefBuilder','$sessionStorage',
 function ($scope, $uibModal, filterFilter, $location, $window, FattureService,FattureFornitoriService, $filter, DTOptionsBuilder, DTColumnDefBuilder,$sessionStorage) {
	'use strict';
	//TODO eliminare FattureService
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
		DTColumnDefBuilder.newColumnDef(1).withOption('width', '32%'),
		DTColumnDefBuilder.newColumnDef(2).withOption('type', 'custom_sort_numero').withOption('width', '8%'),
		DTColumnDefBuilder.newColumnDef(3).withOption('width', '15%'),
		DTColumnDefBuilder.newColumnDef(4).withOption('width', '10%'),
		DTColumnDefBuilder.newColumnDef(5).withOption('type', 'custom_sort_currency').withOption('width', '20%'), 
		DTColumnDefBuilder.newColumnDef(6).notSortable().withOption('width', '10%')
		  

	];
	
	// START PUBLIC FUNCTIONS

	//funzione che recupera la lista di tutte le fatture
	/*
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
	}*/
	
	//funzione che recupera la lista di tutti le fatture con filtri
	$scope.getFattureWithFilterList = function (tipoFattura, descFattura){	
		if(tipoFattura){
			$scope.filters.filter.tipoFattura = tipoFattura;
			$scope.descTipoFattura = descFattura;

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
		FattureFornitoriService.getFattureWithFilterList($scope.filters).then(function(response) {
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
		$location.url('fatture-acquisto/inserisciFattura/'+tipoFattura);
	}
	
	$scope.creaPdfFattura = function(p_id){	
		$scope.spinner.on();
		FattureService.creaPdfFattura(p_id).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				console.log("pdf creato correttamente");
				var urlTemp = $location.protocol()+":\/\/"+$location.host()+":"+$location.port();
				$window.open(urlTemp+"/pdf/show/"+response.data.nomeFile);					
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );					
			}  
			$scope.spinner.off();	
	    });	
	}
	//Gestione Preferiti su fattura
	$scope.setPreferita = function(p_id, flagPreferita, numeroFattura){	
		$scope.spinner.on();
		FattureFornitoriService.setPreferita(p_id, flagPreferita).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
	    		var mess = flagPreferita?"non":"";
				toastr.success("Fattura " + numeroFattura +" impostata come "+mess+" preferita" );
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
			$location.url("/fatture-acquisto/modificaFattura/"+p_id);
		} else if(p_stato.toUpperCase() === 'PAGATO' || p_stato.toUpperCase() === 'PAGAMENTO PARZIALE' ){//TODO
			$location.url("/fatture-acquisto/dettaglioFattura/"+p_id);
		} else {
			//..
		}
	}	

	//open modale pagamento fattura
	$scope.openModalPagamentoFatture = function (pIdFattura) {		
		$scope.idFattura = pIdFattura;
		$uibModal.open({
		templateUrl: './html/fatture-fornitori/modalPagamentoFattureFornitore.html',
		scope:$scope,	
		backdrop:'static',
		size: 'lg',	
		controller: 'PagamentoFattureFornitoreController'
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
 	 };

	  //open modale di pagamento massivo
		
	$scope.openModalPagamentoFattureMassivo = function () {	
		//verifichiamo che siano state selezionate fatture dello stesso fornitore
		var blockMultiFornitore = false;
		var idFornitore = null;
		angular.forEach($scope.fatture,function(fat){
			  
			if(fat.checked){
				if(idFornitore == null) {
					idFornitore = fat.ID_FORNITORE;
				} else {
					if(fat.ID_FORNITORE != idFornitore){
					blockMultiFornitore = true;	
					}	
				}

			}

		})

		if(blockMultiFornitore){
			toastr.error("Non è possibile effettuare il pagamento massivo per fornitori differenti" );

		} else {
$uibModal.open({
		templateUrl: './html/fatture-fornitori/modalPagamentoFattureFornitoreMassivo.html',
		scope:$scope,	
		backdrop:'static',		
		controller: 'PagamentoMassivoFattureFornitoreController'
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
		}
		
	  };
	 

	  
	$scope.abilitaDisabilitaPagamentoMassimo = function (){
		$scope.abilitaPagamentoMassivo = false;		
		angular.forEach($scope.fatture, function(item){
			if(item.checked){
				$scope.abilitaPagamentoMassivo = true;				
			}
			
		});

	}

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

