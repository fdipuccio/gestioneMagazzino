angular.module("gestionaleApp")
.controller("ClienteController",
 ['$scope','$uibModal','filterFilter','$location','$sessionStorage','ClienteService','CommonService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, filterFilter,$location,$sessionStorage, ClienteService, CommonService, DTOptionsBuilder, DTColumnDefBuilder) {
	 'use strict';
	$scope.model ={};	
	$scope.clienti = [];		
	$scope.sezioneRichiamante = "cliente";
	
	$scope.transient = {};		
	$scope.transient.nuovoConto = {};
	
	$scope.idClienteSelezionato = 0;

	$scope.filters = {};
	$scope.filters.filter = {};
	
	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('responsive', true).withLanguageSource('//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json');
	$scope.dtColumnDefs = [          
		DTColumnDefBuilder.newColumnDef(6).notSortable()
	];

	// START PUBLIC FUNCTIONS

	//funzione che recupera la lista di tutti gli utenti
	$scope.getClientiList = function (){
		//invocazione service
		$scope.spinner.on();
		ClienteService.getClientiList().then(function(response) {  

			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.clienti = response.data.customers;									
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}
	    	$scope.spinner.off();  	
	    });		
	}

	//funzione che recupera la lista dei clienti con parametri di ricerca
	$scope.getAdvSearchClientiList = function (){

		//invocazione service
		$scope.spinner.on();
		ClienteService.getAdvSearchClientiList($scope.filters).then(function(response) {  

			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.clienti = response.data.customers;									
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}
	    	$scope.spinner.off();  	
	    });		
	}
	//Gestione tasto invio su ricerca cliente
	$scope.gotoSearch = function(event) {
		if(event.keyCode == 13) {
			$scope.getAdvSearchClientiList();
		}
	}

	//open modale di inserimento utente
	$scope.openModalNewCliente = function () {
		$scope.transient.newCliente = {};
		$uibModal.open({
		templateUrl: './html/clienti/modalNewCliente.html',
		scope:$scope,	
		backdrop:'static',
		size: 'lg',	
		controller: 'NuovoClienteController'
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
 	 };
	
	
	$scope.openModalEditConti = function (p_id, p_nome) {
		$scope.idClienteSelezionato = p_id;
		$scope.nomeClienteSelezionato = p_nome;
		$scope.transient.nuovoConto = {};
		$uibModal.open({
		templateUrl: './html/clienti/modalEditConti.html',
		scope:$scope,	
		backdrop:'static',
		size: 'lg',	
		controller: 'ClienteContiController'
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
 	 };


	//recupero utente ById e apertura modale di modifica
	$scope.openModalEditCliente = function (p_id) {
		$scope.idClienteSelezionato = p_id;
		//recupero utente
		ClienteService.getClienteById(p_id).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.transient.editCliente = popolaClienteFromClienteDB(response.data.customer);						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}    	
	    });	

		//apertura modale
		$uibModal.open({
		templateUrl: './html/clienti/modalEditCliente.html',
		scope:$scope,
		backdrop:'static',
		size: 'lg',		
		controller: 'ModificaClienteController'
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
 	 };

	$scope.askConfirmationDelete = function(p_id) {
		var message = "Sei sicuro di voler eliminare questo cliente?";
		var modalHtml = '<div class="modal-body">' + message + '</div>';
		modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="confirmDeleteCliente()">OK</button><button class="btn btn-warning" ng-click="cancelDelete()">Cancel</button></div>';

		$uibModal.open({
			template: modalHtml,
			scope:$scope,
			backdrop:'static',		
			controller: function ($scope, $uibModalInstance) {
				$scope.confirmDeleteCliente = function () {
					$scope.removeCliente(p_id);
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
	 
	$scope.removeCliente = function (p_id){
		console.log("removeCLiente = " + p_id);
		ClienteService.removeCliente(p_id).then(function(response) {  

			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				toastr.success("Cliente cancellato correttamente"); 
				$scope.getClientiList(); 									
	    	} else {
				var message = "errore_cliente_codice_"+handleResponseResult.errorCode;
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - " + $scope.labels[message]);
			}
	    	   	
	    });				
	}

	$scope.openModalNewAppuntamentoCli = function (p_id) {
		$scope.transient.newAppuntamentoCli = {};
		$scope.transient.newAppuntamentoCli.appuntamento = {};
		$scope.transient.newAppuntamentoCli.appuntamento.idCliente = p_id;
		$uibModal.open({
		templateUrl: './html/clienti/modalNewAppuntamentoCli.html',
		scope:$scope,
		backdrop:'static',
		size: 'md',	
		controller: function ($scope, $uibModalInstance) {
			$scope.createNewAppuntamentoCliButton = function () {
				if($scope.checkDataRange()){
					//$scope.newAppuntamentoCliForm.endDate.$setValidity("range", false);
					toastr.error("Errore - la data fine deve essere successiva alla data inizio");	
				}else{
					createNewAppuntamentoCli($uibModalInstance);
				}
				
			};		
			$scope.cancelNewAppuntamentoCliButton = function () {
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
	function createNewAppuntamentoCli($uibModalInstance){
		console.log("createNewAppuntamentoCli");
		//adding default values
		ClienteService.createAppuntamentoCli($scope.transient.newAppuntamentoCli.appuntamento.idCliente, $scope.transient.newAppuntamentoCli).then(function(response) {  
	    	if(response!=null && response.data != null && response.data.status =='OK'){
				toastr.success("Appuntamento Cliente creato"); 
				$uibModalInstance.dismiss('cancel');
	    	} else {
				toastr.error("errore creazione Appuntamento Cliente");				
			}    	
		});
	}
	
	$scope.checkDataRange = function(){
		return moment($scope.transient.newAppuntamentoCli.appuntamento.startDate, 'DDMMYYYYHHmmss').toDate().getTime() > moment($scope.transient.newAppuntamentoCli.appuntamento.endDate, 'DDMMYYYYHHmmss').toDate().getTime();
	}

	// END PUBLIC FUNCTIONS

	//init page
	//$scope.getClientiList();
	
	
	//private functions
	
	$scope.dettaglioCliente = function(p_id){
		$location.url('clienti/dettaglioCliente/'+p_id);
	}	

	 function popolaClienteFromClienteDB(clienteDB){
		var cliente = {};

		cliente.nome = clienteDB.NOME;		
		cliente.provincia = clienteDB.PROVINCIA;
		cliente.regione = clienteDB.REGIONE;
		cliente.cap = clienteDB.CAP;
		cliente.citta = clienteDB.CITTA;
		cliente.indirizzo = clienteDB.INDIRIZZO;
		cliente.note_extra_indirizzo = clienteDB.NOTE_EXTRA_INDIRIZZO;
		cliente.codice_fiscale = clienteDB.CODICE_FISCALE;
		cliente.partita_iva = clienteDB.PARTITA_IVA;
		cliente.telefono = clienteDB.TELEFONO;
		cliente.fax = clienteDB.FAX;
		cliente.mail = clienteDB.MAIL;
		cliente.iva_applicata_prod = clienteDB.IVA_APPLICATA_PROD;
		cliente.iva_applicata_serv = clienteDB.IVA_APPLICATA_SERV;
		cliente.fatt_elettronica_pz = clienteDB.FATT_ELETTRONICA_PZ;
		cliente.note_cliente = clienteDB.NOTE_CLIENTE;
		return cliente;

	}

}]);

