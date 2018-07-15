angular.module("gestionaleApp")
.controller("CaricoScaricoQuantitaArticoloController",
 ['$scope','$uibModal','$uibModalInstance','filterFilter','$sessionStorage','ArticoliService','CommonService','$filter',
 function ($scope, $uibModal, $uibModalInstance, filterFilter, $sessionStorage, ArticoliService, CommonService, $filter) {
	 'use strict';
	$scope.model ={};	
	$scope.articoli = [];
	$scope.transient.mostraRicerca = true;
	$scope.persistent = {};
	$scope.persistent.articoloSelezionato = {};		
	$scope.transient = {};
	$scope.transient.numeroScatoli = 1;
	$scope.transient.listaScatoli = [];
	$scope.transient.carico = {};
	$scope.transient.carico.filters = {};
	$scope.transient.carico.filters.filter = {};
	$scope.transient.flagArticoloSelezionato = false;
	$scope.transient.flagArticoliUguali = true;
	$scope.transient.listaScatoliScarico = [];
	
	$scope.transient.paginaProvenienza = "home";
	

	if($scope.$parent.transient.idArticoloDaLista){
		$scope.transient.paginaProvenienza = "lista";

		$scope.spinner.on();
		ArticoliService.getArticoloById($scope.$parent.transient.idArticoloDaLista).then(function(response) { 
			//invocazione service
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.persistent.articoloSelezionato = response.data.articolo;	
				$scope.transient.flagArticoloSelezionato=true;		

				if($scope.$parent.transient.tipoOperazione == 'SCARICO'){
					//TODO richiamre servizio per lista
					$scope.transient.listaScatoliScarico = [];
					var scatoloScarico = {};
					scatoloScarico.selected = true;
					scatoloScarico.lotto = "LT1";
					scatoloScarico.dataScadenza = "01/08/2018";
					$scope.transient.listaScatoliScarico.push(scatoloScarico);
					var scatoloScarico1 = {};
					scatoloScarico1.selected = false;
					scatoloScarico1.lotto = "LT2";
					scatoloScarico1.dataScadenza = "30/08/2018";
					$scope.transient.listaScatoliScarico.push(scatoloScarico1);
				}

			} else {
				toastr.error("Errore: "+ response.data.errMessage + " - GESTIONE ERRORE DA FARE!!!" );
			}
	    	$scope.spinner.off();  		
		});
	}

	

	

	// START PUBLIC FUNCTIONS

	
	$scope.cancelCaricoArticoloButton = function () {
		//$uibModalInstance.close(false);
		$uibModalInstance.dismiss('cancel');		
	};

	

	
	// END PUBLIC FUNCTIONS

	//init page
	
		
	//private functions
	$scope.ricercaArticoloByCodiceBarre = function(){
		console.log("ricercaArticoloByCodiceBarre");	
		//adding default values
		$scope.spinner.on();
		ArticoliService.getAdvSearchArticoliList($scope.transient.carico.filters).then(function(response) { 
			//invocazione service
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.persistent.articoloSelezionato = response.data.articoli[0];
				$scope.transient.flagArticoloSelezionato = true;
				if($scope.$parent.transient.tipoOperazione == 'SCARICO'){
					//TODO richiamre servizio per lista
					$scope.transient.listaScatoliScarico = [];
					var scatoloScarico = {};
					scatoloScarico.selected = true;
					scatoloScarico.lotto = "LT1";
					scatoloScarico.dataScadenza = "01/08/2018";
					$scope.transient.listaScatoliScarico.push(scatoloScarico);
					var scatoloScarico1 = {};
					scatoloScarico1.selected = false;
					scatoloScarico1.lotto = "LT2";
					scatoloScarico1.dataScadenza = "30/08/2018";
					$scope.transient.listaScatoliScarico.push(scatoloScarico1);
				}
			} else {
				toastr.error("Errore: "+ response.data.errMessage + " - GESTIONE ERRORE DA FARE!!!" );
			}
	    	$scope.spinner.off();  		
		});
	}

	$scope.resetArticoloSelezionato = function(){
		$scope.persistent.articoloSelezionato = {};
		$scope.transient.flagArticoloSelezionato = false;
		$scope.transient.numeroScatoli = 1;
	}

	$scope.applicaNumeroScatolo = function(){
		$scope.transient.listaScatoli = [];
		
		if($scope.transient.flagArticoliUguali) {
				var scatolo = {};				
				$scope.transient.listaScatoli.push(scatolo);
		} else {
			for(var i = 0; i< $scope.transient.numeroScatoli ;i++){
				var scatolo = {};				
				$scope.transient.listaScatoli.push(scatolo);
		 	}
		}

		 
	};

	$scope.salvaCaricoArticoloButton = function(){
		var lotto = {};

		lotto.operazione = "CARICO";
		lotto.qty = $scope.transient.numeroScatoli;
		lotto.articoli = $scope.transient.listaScatoli;
		lotto.accorpaArticoli = $scope.transient.flagArticoliUguali;
		lotto.dataOperazione = $filter('date')(new Date(), "dd/MM/yyyy");
		$scope.spinner.on();	
		ArticoliService.caricoQuantitaArticolo($scope.persistent.articoloSelezionato.idArticolo, lotto).then(function(response) { 
			//invocazione service
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				toastr.success("Carico articolo registrato correttamente");
			} else {
				toastr.error("Errore: "+ response.data.errMessage + " - Errore nel carico articoli" );
			}
	    	$scope.spinner.off();  		
		});
	}

	$scope.confermaScaricoArticoloButton = function(){
		var lotto = {};

		lotto.operazione = "SCARICO";
		lotto.qty = $scope.transient.numeroScatoli;
		lotto.articoli = $scope.transient.listaScatoliScarico;		
		lotto.dataOperazione = $filter('date')(new Date(), "dd/MM/yyyy");
		$scope.spinner.on();	
		ArticoliService.scaricoQuantitaArticolo($scope.persistent.articoloSelezionato.idArticolo, lotto).then(function(response) { 
			//invocazione service
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				toastr.success("Scarico articolo registrato correttamente");
			} else {
				toastr.error("Errore: "+ response.data.errMessage + " - Errore nello scarico articoli" );
			}
	    	$scope.spinner.off();  		
		});
	}

	/*
	$scope.$watch("transient.numeroScatoli", function(newValue, oldValue) {
		 console.log("newValue:" + newValue);
   
	});
	*/
}]);
