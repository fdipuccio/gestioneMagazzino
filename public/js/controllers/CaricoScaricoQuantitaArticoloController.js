angular.module("gestionaleApp")
.controller("CaricoScaricoQuantitaArticoloController",
 ['$scope','$uibModal','$uibModalInstance','filterFilter','$sessionStorage','ArticoliService','MagazzinoService','FornitoreService','CommonService','$filter',
 function ($scope, $uibModal, $uibModalInstance, filterFilter, $sessionStorage, ArticoliService,MagazzinoService, FornitoreService,CommonService, $filter) {
	 'use strict';
	$scope.model ={};	
	$scope.articoli = [];
	$scope.transient.mostraRicerca = true;
	$scope.persistent = {};
	$scope.persistent.articoloSelezionato = {};		
	$scope.transient = {};
	$scope.transient.nuovoLotto = {};
	$scope.transient.nuovoLotto.numeroScatoli = 1;	
	$scope.transient.nuovoLotto.dataInserimento = $filter('date')(new Date(), "dd/MM/yyyy");
	$scope.transient.nuovoLotto.dataOperazione = $filter('date')(new Date(), "dd/MM/yyyy");
	$scope.transient.nuovoLotto.prezzoAcquisto;
	$scope.transient.nuovoLotto.operazione = "CARICO";	
	$scope.transient.nuovoLotto.articoli = [];
	$scope.transient.carico = {};
	$scope.transient.carico.filters = {};
	$scope.transient.carico.filters.filter = {};
	$scope.transient.flagArticoloSelezionato = false;
	$scope.transient.flagArticoliUguali = true;
	$scope.transient.listaScatoliScarico = [];
	$scope.transient.mostraStep2Carico = false;
	$scope.transient.scarico = {};
	$scope.transient.scarico.qty = 1;

	$scope.transient.mostraArticoloNonPresente=false;

	$scope.transient.paginaProvenienza = "home";
	$scope.transient.filters = {};

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
					$scope.invocaPreviewScarico();
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
	
		
	
	$scope.ricercaArticoloByCodiceBarre = function(){
		console.log("ricercaArticoloByCodiceBarre");	
		//adding default values
		
		$scope.spinner.on();
		ArticoliService.getAdvSearchArticoliList($scope.transient.carico.filters).then(function(response) { 
			//invocazione service
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.persistent.articoloSelezionato = response.data.articoli[0];
				if($scope.persistent.articoloSelezionato === undefined || $scope.persistent.articoloSelezionato === null){
							
					$scope.transient.mostraArticoloNonPresente=true;								

				} else {
					$scope.transient.mostraArticoloNonPresente=false;
					$scope.transient.flagArticoloSelezionato = true;
					if($scope.$parent.transient.tipoOperazione == 'SCARICO'){
						$scope.invocaPreviewScarico();					
					}
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

	$scope.aggiungiPrimoArticolo = function(){
		$scope.transient.mostraStep2Carico = true;
		if($scope.transient.flagArticoliUguali){
			$scope.transient.nuovoLotto.articoli = [];
			var scatolo = {};	
			scatolo.qty = $scope.transient.nuovoLotto.numeroScatoli;		
		    $scope.transient.nuovoLotto.articoli.push(scatolo);
		} else {
			var scatolo = {};	
			scatolo.qty = 1;		
			$scope.transient.nuovoLotto.articoli.push(scatolo);
			
		}		 
	};

	$scope.aggiungiArticoloButton = function(){
		var scatolo = {};	
		scatolo.qty = 1;		
		$scope.transient.nuovoLotto.articoli.push(scatolo);
		$scope.transient.mostraStep2Carico = true;
	}

	$scope.rimuoviArticoloButton = function(pArt){
		var index = $scope.transient.nuovoLotto.articoli.indexOf(pArt);
		$scope.transient.nuovoLotto.articoli.splice(index, 1);
	}


	$scope.salvaCaricoArticoloButton = function(){
		
		var qtyTotale = 0;
		angular.forEach($scope.transient.nuovoLotto.articoli, function(item) {
  			qtyTotale +=Number(item.qty);
		});
		
		if(qtyTotale !== $scope.transient.nuovoLotto.numeroScatoli){
			toastr.warning("Attenzione: La quantita totale non è uguale alle quantita inserite" );
		} else {
			$scope.transient.nuovoLotto.idArticolo = $scope.persistent.articoloSelezionato.idArticolo;		
			
			$scope.spinner.on(); 
			MagazzinoService.caricoQuantitaArticolo($scope.transient.nuovoLotto).then(function(response) { 
				//invocazione service
				var handleResponseResult = $scope.handleResponse(response);  
				if(handleResponseResult.next){
					toastr.success("Carico articolo registrato correttamente");
					$uibModalInstance.dismiss('cancel');
				} else {
					toastr.error("Errore: "+ response.data.errMessage + " - Errore nel carico articoli" );
				}
				$scope.spinner.off();  		
			});
		}

		
	}
	/*
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
	}*/

	$scope.getFornitoriWithTypeAhead = function (){
		$scope.transient.nuovoLotto.idFornitore = "";
		if($scope.transient.fornitoreObject !== null && $scope.transient.fornitoreObject !== undefined && 
			$scope.transient.fornitoreObject !== '' &&
			$scope.transient.fornitoreObject.length > 2){
			
			$scope.filters.filter.nome = $scope.transient.fornitoreObject;
			FornitoreService.getAdvSearchFornitoriList($scope.filters).then(function(response) {  

			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.fornitori = response.data.suppliers;									
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}
	    	$scope.spinner.off();  	
	    });		
		} else {
				$scope.transient.nuovoLotto.idFornitore = "";	
				$scope.transient.fornitore = "";				
		}
	}
	//funzione richiamata quando si seleziona un comune dal typeahead
	$scope.onSelectFornitore = function ($item, $model, $label) {
		if($item != null){
				$scope.transient.nuovoLotto.idFornitore = $item.idfornitore;				
		} else {
				$scope.transient.nuovoLotto.idFornitore = "";			
		}
	}
	

	$scope.invocaPreviewScarico = function (){

		var scarico = {};
		scarico.idArticolo = $scope.persistent.articoloSelezionato.idArticolo;
		scarico.qty = $scope.transient.scarico.qty;


		MagazzinoService.previewScaricoQuantitaArticolo(scarico).then(function(response) { 
				//invocazione service
				var handleResponseResult = $scope.handleResponse(response);  
				if(handleResponseResult.next){
					
					$scope.transient.listaScatoliScarico = response.data.scarico;

				} else {
					toastr.error("Errore: "+ response.data.errMessage + " - Errore nel carico articoli" );
				}
				$scope.spinner.off();  		
			});					
	}

	$scope.confermaScaricoArticoloButton = function (){

		var scaricoTemp = [];
		
		angular.forEach($scope.transient.listaScatoliScarico, function(item) {
  			if(item.selected && item.qtyRelese > 0){
				item.scadenza=$filter('date')(item.scadenza, "dd/MM/yyyy");
				scaricoTemp.push(item);
			  }
		});
		if(scaricoTemp.length > 0){
			$scope.spinner.on();			
			MagazzinoService.scaricoQuantitaArticolo(scaricoTemp).then(function(response) { 
				//invocazione service
				var handleResponseResult = $scope.handleResponse(response);  
				if(handleResponseResult.next){
					
					toastr.success("Scarico articolo registrato correttamente");
					$uibModalInstance.dismiss('cancel');

				} else {
					toastr.error("Errore: "+ response.data.errMessage + " - Errore nel carico articoli" );
				}
				$scope.spinner.off();  		
			});
		} else {
			toastr.warning("La quantità totale che si sta provando a scaricare non è valida" );
		}
							
	}
	
	$scope.gotoNuovoArticolo = function (){				
		$uibModalInstance.dismiss('cancel');
		$scope.$parent.openModalNewArticolo($scope.transient.carico.filters.filter.codiceBarre);
	}


	$scope.$watch("transient.flagArticoliUguali", function(newValue, oldValue) {
		$scope.transient.mostraStep2Carico = false;
		$scope.transient.nuovoLotto.articoli = [];
	});

	$scope.$watch("transient.scarico.qty", function(newValue, oldValue) {
		if(newValue!==oldValue){
			$scope.invocaPreviewScarico();
		}
		
	});
	
	$scope.$watch("transient.nuovoLotto.numeroScatoli", function(newValue, oldValue) {
		if(newValue!==oldValue){
			
			if($scope.transient.nuovoLotto.articoli.length > 0
			&& $scope.transient.flagArticoliUguali){
				$scope.transient.mostraStep2Carico = false;
				$scope.transient.nuovoLotto.articoli = [];
			}

		}
		
	});

}]);
