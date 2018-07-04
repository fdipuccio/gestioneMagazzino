angular.module("gestionaleApp")
.controller("DipendenteController",
 ['$scope','$uibModal','filterFilter','$location','$sessionStorage','DipendenteService','CommonService','UserService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, filterFilter,$location,$sessionStorage, DipendenteService, CommonService,UserService, DTOptionsBuilder, DTColumnDefBuilder) {
	 'use strict';
	$scope.model ={};	
	$scope.dipendenti = [];		
	$scope.sezioneRichiamante = "dipendente";
	
	$scope.transient = {};	

	$scope.listaTipoContratto = ['Tempo Indeterminato', 'Tempo Determinato', 'Somministrazione', 'Apprendistato', 'Part Time', 'A Progetto', 'Tirocinio'];
	
	$scope.persistent = {};
	$scope.persistent.editDipendente = {};
	
	$scope.matricolaDipendente = "0";

	$scope.filters = {};
	$scope.filters.filter = {};
	
	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('responsive', true).withLanguageSource('//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json');
	$scope.dtColumnDefs = [          
		DTColumnDefBuilder.newColumnDef(6).notSortable()
	];

	// START PUBLIC FUNCTIONS

	//funzione che recupera la lista di tutti gli utenti
	$scope.getDipendentiList = function (){
		//invocazione service
		$scope.spinner.on();
		DipendenteService.getDipendentiList().then(function(response) {  

			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.dipendenti = response.data.dipendenti;									
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}
	    	$scope.spinner.off();  	
	    });		
	}

	$scope.getUserList = function (){
		//invocazione service
		UserService.getUserList().then(function(response) {  
	    	if(response!=null && response.data != null){
	    		$scope.usersList = response.data;	    		
	    	}    	
	    });		
	}

	//funzione che recupera la lista dei dipendenti con parametri di ricerca
	$scope.getAdvSearchDipendentiList = function (){

		//invocazione service
		$scope.spinner.on();
		DipendenteService.getAdvSearchDipendentiList($scope.filters).then(function(response) {  

			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.dipendenti = response.data.dipendenti;									
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}
	    	$scope.spinner.off();  	
	    });		
	}
	//Gestione tasto invio su ricerca dipendente
	$scope.gotoSearch = function(event) {
		if(event.keyCode == 13) {
			$scope.getAdvSearchDipendentiList();
		}
	}

	//open modale di inserimento utente
	$scope.openModalNewDipendente = function () {
		$scope.transient.newDipendente = {};
		$uibModal.open({
		templateUrl: './html/dipendenti/modalNewDipendente.html',
		scope:$scope,	
		backdrop:'static',
		size: 'lg',	
		controller: 'NuovoDipendenteController'
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
 	 };
	
	//recupero utente ById e apertura modale di modifica
	$scope.openModalEditDipendente = function (p_matricola) {
		$scope.matricolaDipendente = p_matricola;
		//recupero utente
		DipendenteService.getDipendenteByMatricola(p_matricola).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.persistent.editDipendente = response.data.dipendente;

				$scope.persistent.editDipendente.assunzione = $scope.formatDate($scope.persistent.editDipendente.assunzione);

	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}    	
	    });	

		//apertura modale
		$uibModal.open({
		templateUrl: './html/dipendenti/modalEditDipendente.html',
		scope:$scope,
		backdrop:'static',
		size: 'lg',		
		controller: 'ModificaDipendenteController'
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
 	 };

	$scope.askConfirmationDelete = function(p_id) {
		var message = "Sei sicuro di voler eliminare questo dipendente?";
		var modalHtml = '<div class="modal-body">' + message + '</div>';
		modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="confirmDeleteDipendente()">OK</button><button class="btn btn-warning" ng-click="cancelDelete()">Cancel</button></div>';

		$uibModal.open({
			template: modalHtml,
			scope:$scope,
			backdrop:'static',		
			controller: function ($scope, $uibModalInstance) {
				$scope.confirmDeleteDipendente = function () {
					$scope.removeDipendente(p_id);
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
	 
	$scope.removeDipendente = function (p_id){
		console.log("removeCLiente = " + p_id);
		DipendenteService.removeDipendente(p_id).then(function(response) {  

			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				toastr.success("Dipendente cancellato correttamente"); 
				$scope.getDipendentiList(); 									
	    	} else {
				var message = "errore_dipendente_codice_"+handleResponseResult.errorCode;
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - " + $scope.labels[message]);
			}
	    	   	
	    });				
	}

	$scope.formatDate = function(data){
		var date = new Date(data);
		return date.toLocaleDateString('en-GB')
	}
	// END PUBLIC FUNCTIONS

	//init page
	//$scope.getDipendentiList();
	$scope.getUserList();
	
	//private functions

}]);

