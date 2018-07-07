angular.module("gestionaleApp")
.controller("ArticoliController",
 ['$scope','$uibModal','filterFilter','$sessionStorage','ArticoliService','CommonService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, filterFilter, $sessionStorage, ArticoliService, CommonService, DTOptionsBuilder, DTColumnDefBuilder) {
	 'use strict';
	$scope.model ={};	
	$scope.articoli = [];		
	$scope.transient = {};
	$scope.transient.newArticolo = {};	
	$scope.transient.editArticolo = {};
	$scope.listaIvaApplicata = $sessionStorage.listaIvaApplicata;
	$scope.listaUDM = $sessionStorage.listaUDM;
	$scope.listaValute = $sessionStorage.listaValute;
	$scope.listaCategorie = [];
	$scope.listaTipologie = [{'DESCRIZIONE':'PRODOTTO'},{'DESCRIZIONE':'SERVIZIO'}];
	$scope.sezioneRichiamante = "articoli";
	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('responsive', true).withLanguageSource('//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json');
	$scope.dtColumnDefs = [          
		DTColumnDefBuilder.newColumnDef(0).withOption('width', '25%'),
		DTColumnDefBuilder.newColumnDef(1).withOption('width', '25%'),
		DTColumnDefBuilder.newColumnDef(2).withOption('width', '9%'),
		DTColumnDefBuilder.newColumnDef(3).withOption('width', '9%'),
		DTColumnDefBuilder.newColumnDef(4).withOption('width', '9%'),
		DTColumnDefBuilder.newColumnDef(5).withOption('width', '9%'),
		DTColumnDefBuilder.newColumnDef(5).withOption('width', '9%'),
		DTColumnDefBuilder.newColumnDef(7).notSortable().withOption('width', '6%')
	];
	$scope.filters = {};
	$scope.filters.filter = {};
	// START PUBLIC FUNCTIONS

	//funzione che recupera la lista di tutti gli utenti
	$scope.getArticoliList = function (){
		//invocazione service
		$scope.spinner.on();
		ArticoliService.getArticoliList().then(function(response) { 
			
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.articoli = response.data.articoli;						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}
	    	$scope.spinner.off();
	    });		
	}
	
	//funzione che recupera la lista di tutti le categorie
	$scope.getCategorieArticoliList = function (){
		//invocazione service
		ArticoliService.getCategorieArticoliList().then(function(response) {
			
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.listaCategorie = response.data.categorie;						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}	    	  	
	    });		
	}

	//funzione che recupera la lista dei clienti con parametri di ricerca
	$scope.getAdvSearchArticoliList = function (){
		$scope.spinner.on();
		ArticoliService.getAdvSearchArticoliList($scope.filters).then(function(response) { 
			//invocazione service
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.articoli = response.data.articoli;
			} else {
				toastr.error("Errore: "+ response.data.errMessage + " - GESTIONE ERRORE DA FARE!!!" );
			}
	    	$scope.spinner.off();  		
		});
	}
	//open modale di inserimento articolo
	$scope.openModalNewArticolo = function () {
		$scope.transient.newArticolo = {};
		$uibModal.open({
		templateUrl: './html/articoli/modalNewArticolo.html',
		scope:$scope,	
		backdrop:'static',
		size: 'lg',	
		controller: "NuovoArticoloController"
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
 	 };

	  //apre popup di conferma cancellazione
	$scope.askConfirmationDelete = function(p_id) {
    var message = "Sei sicuro di voler eliminare questo articolo?";
    var modalHtml = '<div class="modal-body">' + message + '</div>';
    modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="confirmDeleteArticolo()">OK</button><button class="btn btn-warning" ng-click="cancelDelete()">Cancel</button></div>';

    $uibModal.open({
		template: modalHtml,
		scope:$scope,	
		backdrop:'static',	
		controller: function ($scope, $uibModalInstance) {
			$scope.confirmDeleteArticolo = function () {
				$scope.removeArticolo(p_id);
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


	$scope.removeArticolo = function (p_id){
		console.log("removeArticolo = " + p_id);
		ArticoliService.removeArticolo(p_id).then(function(response) {  
	    	if(response!=null && response.data != null){
				console.log("articolo eliminato "); 
				$scope.getArticoliList(); 		
	    	}    	
	    });				
	}

	// END PUBLIC FUNCTIONS

	//init page
	//$scope.getArticoliList();
	//$scope.getCategorieArticoliList();
	
	//private functions
	
	function createNewArticolo($uibModalInstance){
		console.log("createNewArticolo");	
		//adding default values
		ArticoliService.createArticolo($scope.transient.newArticolo).then(function(response) { 
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				console.log("articolo creato");  
				$uibModalInstance.dismiss('cancel'); 
				$scope.getArticoliList(); 		
	    	} else {
				if(handleResponseResult.errorCode == 'ART002'){
					toastr.warning("ARTICOLO GIA PRESENTE");
				} else {
					toastr.error("ERRORE ARTICOLO GENERICO");		
				}
						
			}    	 
		});
	}

//open modale di modifica articolo
$scope.openModalEditArticolo = function (idArticolo) {

	//recupero dettaglio articolo
	ArticoliService.getArticoloById(idArticolo).then(function(response) {  

		var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.transient.editArticolo = response.data.articolo[0];	
				//category normalizzata a string per evitare il primmo valore vuoto
				$scope.transient.editArticolo.ID_CATEGORIA = ''+ $scope.transient.editArticolo.ID_CATEGORIA;				
	    	} else {
				toastr.error("TODO - GESTIONE ERRORE");
			}		    	
	});	

	$scope.transient.editArticolo = {};
	$uibModal.open({
	templateUrl: './html/articoli/modalEditArticolo.html',
	scope:$scope,	
	backdrop:'static',
	size: 'lg',	
	controller: function ($scope, $uibModalInstance) {
		$scope.modifyArticoloArticoloButton = function () {
			modifyArticolo($uibModalInstance);
		};		
		$scope.cancelEditArticoloButton = function () {
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

//private functions
	
function modifyArticolo($uibModalInstance){
	console.log("editArticolo");	
	//adding default values
	ArticoliService.editArticolo($scope.transient.editArticolo).then(function(response) { 
		
		var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				console.log("articolo modificato"); 
				$uibModalInstance.dismiss('cancel');
			$scope.getArticoliList();						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}		    	
	});
}

//non usato
function mappingDataArticoloFromDB(articoloDB){

	var articolo = {};
	articolo.idArticolo = articoloDB.ID_ARTICOLO;
	articolo.codiceArticolo = articoloDB.CODICE_ARTICOLO;
	articolo.idCategoria = articoloDB.ID_CATEGORIA;
	articolo.descrizione = articoloDB.DESC_CATEGORIA;
	return articolo;

}

//Gestione tasto invio su ricerca cliente
$scope.gotoSearch = function(event) {
	if(event.keyCode == 13) {
		$scope.getAdvSearchArticoliList();
	}
}

}]);
